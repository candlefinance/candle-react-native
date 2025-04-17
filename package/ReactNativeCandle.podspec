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
    url: "https://github.com/candlefinance/candle-swift",
    requirement: {
      "kind": "revision",
      "revision": "500edb89f41250b8bccd51faa7ce4de7743dc7e1"
    },
    products: ["Candle"]
  )

  # spm_dependency(s,
  #   url: "https://github.com/candlefinance/swift-security.git",
  #   requirement: {
  #     "kind": "branch",
  #     "branch": "main"
  #   },
  #   products: ["SwiftSecurity"]
  # )
  # spm_dependency(s,
  #   url: "https://github.com/apple/swift-openapi-urlsession", 
  #   requirement: {
  #     "kind": "exact",
  #     "exact": "1.0.2"
  #   },
  #   products: ["OpenAPIURLSession"]
  # )
  # spm_dependency(s,
  #   url: "https://github.com/apple/swift-nio.git", 
  #   requirement: {
  #     "kind": "exact",
  #     "exact": "2.81.0"
  #   },
  #   products: ["NIO", "NIOHTTP1", "NIOWebSocket"]
  # )
  # spm_dependency(s,
  #   url: "https://github.com/apple/swift-nio-ssl.git", 
  #   requirement: {
  #     "kind": "exact",
  #     "exact": "2.29.3"
  #   },
  #   products: ["NIOSSL"]
  # )
  # spm_dependency(s,
  #   url: "https://github.com/apple/swift-nio-transport-services.git", 
  #   requirement: {
  #     "kind": "exact",
  #     "exact": "1.23.1"
  #   },
  #   products: ["NIOTransportServices"]
  # )

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
