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
  // Duplicate symbols issue
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

  // reference the "props"
  // const { version, repositoryUrl, repoName, productName } = {
  //   repositoryUrl: "https://github.com/candlefinance/candle-swift",
  //   repoName: "candle-swift",
  //   productName: "Candle",
  //   version: "fa0db96e9a73740bbd4977160894a45c6db96f51",
  // };
  // // get XCRemoteSwiftPackageReference section
  // const spmReferences =
  //   xcodeProject.hash.project.objects["XCRemoteSwiftPackageReference"];
  // // if doesn't exist (this is our first SPM package) create empty object
  // if (!spmReferences) {
  //   xcodeProject.hash.project.objects["XCRemoteSwiftPackageReference"] = {};
  // }
  // // generate new ID
  // const packageReferenceUUID = xcodeProject.generateUuid();
  // // add XCRemoteSwiftPackageReference section
  // xcodeProject.hash.project.objects["XCRemoteSwiftPackageReference"][
  //   `${packageReferenceUUID} /* XCRemoteSwiftPackageReference "${repoName}" */`
  // ] = {
  //   isa: "XCRemoteSwiftPackageReference",
  //   repositoryURL: repositoryUrl,
  //   requirement: {
  //     kind: "revision",
  //     revision: version,
  //   },
  // };

  // get XCSwiftPackageProductDependency section
  // const spmProducts =
  //   xcodeProject.hash.project.objects["XCSwiftPackageProductDependency"];
  // // if doesn't exist (this is our first SPM package) create empty object
  // if (!spmProducts) {
  //   xcodeProject.hash.project.objects["XCSwiftPackageProductDependency"] = {};
  // }
  // // generate new ID
  // const packageUUID = xcodeProject.generateUuid();
  // // add XCSwiftPackageProductDependency section
  // xcodeProject.hash.project.objects["XCSwiftPackageProductDependency"][
  //   `${packageUUID} /* ${productName} */`
  // ] = {
  //   isa: "XCSwiftPackageProductDependency",
  //   // from step before
  //   package: `${packageReferenceUUID} /* XCRemoteSwiftPackageReference "${repoName}" */`,
  //   productName: productName,
  // };

  // get main project ID
  // const projectId = Object.keys(
  //   xcodeProject.hash.project.objects["PBXProject"]
  // ).at(0);
  // // create empty array for package references if it doesn't exist
  // if (
  //   !xcodeProject.hash.project.objects["PBXProject"][projectId][
  //     "packageReferences"
  //   ]
  // ) {
  //   xcodeProject.hash.project.objects["PBXProject"][projectId][
  //     "packageReferences"
  //   ] = [];
  // }
  // // add our package reference (use ID from first step)
  // xcodeProject.hash.project.objects["PBXProject"][projectId][
  //   "packageReferences"
  // ] = [
  //   ...xcodeProject.hash.project.objects["PBXProject"][projectId][
  //     "packageReferences"
  //   ],
  //   `${packageReferenceUUID} /* XCRemoteSwiftPackageReference "${repoName}" */`,
  // ];

  // // generate new ID
  // const frameworkUUID = xcodeProject.generateUuid();
  // // add comment and reference to our framework in PBXBuildFile section
  // xcodeProject.hash.project.objects["PBXBuildFile"][
  //   `${frameworkUUID}_comment`
  // ] = `${productName} in Frameworks`;
  // xcodeProject.hash.project.objects["PBXBuildFile"][frameworkUUID] = {
  //   isa: "PBXBuildFile",
  //   productRef: packageUUID,
  //   productRef_comment: productName,
  // };

  // // get first build phase
  // const buildPhaseId = Object.keys(
  //   xcodeProject.hash.project.objects["PBXFrameworksBuildPhase"]
  // ).at(0);
  // // create empty array for files if it doesn't exist
  // if (
  //   !xcodeProject.hash.project.objects["PBXFrameworksBuildPhase"][buildPhaseId][
  //     "files"
  //   ]
  // ) {
  //   xcodeProject.hash.project.objects["PBXFrameworksBuildPhase"][buildPhaseId][
  //     "files"
  //   ] = [];
  // }
  // // add our framework reference (use ID from step 4)
  // xcodeProject.hash.project.objects["PBXFrameworksBuildPhase"][buildPhaseId][
  //   "files"
  // ] = [
  //   ...xcodeProject.hash.project.objects["PBXFrameworksBuildPhase"][
  //     buildPhaseId
  //   ]["files"],
  //   `${frameworkUUID} /* ${productName} in Frameworks */`,
  // ];

  return config;
};

module.exports = plugin;
