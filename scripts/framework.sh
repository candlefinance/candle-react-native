# This script builds the MLX framework for iOS
cd package/ios

xcodebuild archive \
  -scheme ReactNativeCandle \
  -destination "generic/platform=iOS" \
  -archivePath output/ReactNativeCandle \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

xcodebuild archive \
  -scheme ReactNativeCandle \
  -destination "generic/platform=iOS Simulator" \
  -archivePath output/ReactNativeCandle-simulator \
  OTHER_SWIFT_FLAGS="-no-verify-emitted-module-interface" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES

rm -rf ReactNativeCandle.xcframework

xcodebuild -create-xcframework \
-framework output/ReactNativeCandle.xcarchive/Products/Library/Frameworks/ReactNativeCandle.framework \
-framework output/ReactNativeCandle-simulator.xcarchive/Products/Library/Frameworks/ReactNativeCandle.framework \
-output ReactNativeCandle.xcframework