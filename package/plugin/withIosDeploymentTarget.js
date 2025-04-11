const {
  withDangerousMod,
  withXcodeProject,
  withPlugins,
} = require("@expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const fs = require("fs");
const path = require("path");

const plugin = (config, options = {}) => {
  return withPlugins(config, [
    [
      withDangerousMod,
      [
        "ios",
        async (config) => {
          return withIosDeploymentTarget(config);
        },
      ],
    ],
    [
      withXcodeProject,
      async (config) => {
        return withMyCustomBuildPhase(config);
      },
    ],
  ]);
};

// This function sets the iOS deployment target to 17.0
const withIosDeploymentTarget = async (config) => {
  // Find the Podfile
  const podfile = path.join(config.modRequest.platformProjectRoot, "Podfile");
  // Read the Podfile
  const podfileContents = fs.readFileSync(podfile, "utf8");
  // Merge the contents of the Podfile with the new content setting
  // the deployment target of all targets to 17.0
  const setDeploymentTarget = mergeContents({
    tag: "ios-deployment-target",
    src: podfileContents,
    newSrc: `    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '17.0'
      end
    end`,
    anchor: /post_install do \|installer\|/i,
    offset: 1,
    comment: "#",
  });

  if (!setDeploymentTarget.didMerge) {
    console.log("Failed to set iOS deployment target");
    return config;
  }

  const setPreInstallHook = mergeContents({
    tag: "rnreanimated-preinstall",
    src: setDeploymentTarget.contents,
    newSrc: `  pre_install do |installer|
    installer.pod_targets.each do |pod|
      if pod.name.eql?('RNReanimated')
        def pod.build_type;
          # This is a workaround for the issue with the dynamic library
          Pod::BuildType.static_library;
        end
      end
    end
  end`,
    anchor: /post_install do \|installer\|/i,
    offset: 0,
    comment: "#",
  });

  if (!setPreInstallHook.didMerge) {
    console.log("Failed to insert RNReanimated pre_install hook");
    return config;
  }

  fs.writeFileSync(podfile, setPreInstallHook.contents);

  return config;
};

// This function adds a custom build phase to the Xcode project
// that removes signature files from the build directory
// for Xcode 15 and 16. This is a workaround for a known issue
// with these versions of Xcode.
// I think it's because of the duplicate symbol issue.
const withMyCustomBuildPhase = async (config) => {
  const xcodeProject = config.modResults;
  const shellScript = `if { [ "$XCODE_VERSION_MAJOR" = "1500" ] || [ "$XCODE_VERSION_MAJOR" = "1600" ]; } && [ "$CONFIGURATION" = "Release" ]; then
  echo "Remove signature files (Xcode 15/16 workaround, only in Release)"
  find "$BUILD_DIR/\${CONFIGURATION}-iphoneos" -name "*.signature" -type f | xargs -r rm
fi`;

  xcodeProject.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Remove Framework signature files (Xcode 15/16 workaround)",
    null,
    {
      shellPath: "/bin/sh",
      shellScript,
      runOnlyForDeploymentPostprocessing: 1,
    }
  );

  return config;
};

module.exports = plugin;
