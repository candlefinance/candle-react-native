require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeCandle"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => '17.0', :visionos => 1.0 }
  s.source       = { :git => "https://github.com/candlefinance/candle-react-native.git", :tag => "#{s.version}" }

  s.source_files = [
    # Implementation (Swift)
    "ios/Sources/**/*.{swift}",
    # Autolinking/Registration (Objective-C++)
    "ios/**/*.{m,mm}",
    # Implementation (C++ objects)
    "cpp/**/*.{hpp,cpp}",
  ]

  spm_dependency(s,
    url: "https://github.com/candlefinance/candle-swift.git",
    requirement: {
      "kind": "revision",
      "revision": "fa0db96e9a73740bbd4977160894a45c6db96f51"
    },
    products: ["Candle"]
  )

  s.pod_target_xcconfig = {
    # C++ compiler flags, mainly for folly.
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG FOLLY_CFG_NO_COROUTINES"
  }

  load 'nitrogen/generated/ios/ReactNativeCandle+autolinking.rb'
  add_nitrogen_files(s)

  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  install_modules_dependencies(s)
end
