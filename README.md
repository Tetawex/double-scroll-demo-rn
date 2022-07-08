## Environment setup:
https://reactnative.dev/docs/environment-setup

## Run the app:
Run `yarn`. If planning to run on iOS, also run `pod repo update` and `pod install` in the `./ios` folder.

# Dev mode with bundler:
Android:
```sh
yarn android
```
iOS:
```sh
yarn ios
```
# Release:
Android - build `release` `buildVariant` with Android Studio or with a gradle command (see [https://reactnative.dev/docs/publishing-to-app-store](https://reactnative.dev/docs/signed-apk-android#testing-the-release-build-of-your-app))

iOS - configure release scheme and build (see https://reactnative.dev/docs/publishing-to-app-store)
