const { withDangerousMod } = require("@expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const fs = require("fs");
const path = require("path");

const withIosDeploymentTarget = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      // Find the Podfile
      const podfile = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
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
    },
  ]);
};

module.exports = withIosDeploymentTarget;
