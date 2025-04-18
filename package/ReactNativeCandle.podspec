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
    url: "https://github.com/candlefinance/swift-security",
    requirement: {
      "kind": "branch",
      "branch": "main"
    },
    products: ["SwiftSecurity"]
  )
  spm_dependency(s,
    url: "https://github.com/apple/swift-openapi-urlsession", 
    requirement: {
      "kind": "exactVersion",
      "version": "1.0.2"
    },
    products: ["OpenAPIURLSession"]
  )
  spm_dependency(s,
    url: "https://github.com/apple/swift-nio", 
    requirement: {
      "kind": "exactVersion",
      "version": "2.81.0"
    },
    products: ["NIO", "NIOHTTP1", "NIOWebSocket"]
  )
  spm_dependency(s,
    url: "https://github.com/apple/swift-nio-ssl", 
    requirement: {
      "kind": "exactVersion",
      "version": "2.29.3"
    },
    products: ["NIOSSL"]
  )
  spm_dependency(s,
    url: "https://github.com/apple/swift-nio-transport-services", 
    requirement: {
      "kind": "exactVersion",
      "version": "1.23.1"
    },
    products: ["NIOTransportServices"]
  )

  s.pod_target_xcconfig = {
    # C++ compiler flags, mainly for folly.
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG FOLLY_CFG_NO_COROUTINES"
  }

  load 'nitrogen/generated/ios/ReactNativeCandle+autolinking.rb'
  add_nitrogen_files(s)

  s.dependency 'Candle', '3.0.228-beta'
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  install_modules_dependencies(s)
end
