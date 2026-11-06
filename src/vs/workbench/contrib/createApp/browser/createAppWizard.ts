import { ICommandService } from 'vs/platform/commands/common/commands';
import { IQuickInputService, QuickPickItem } from 'vs/platform/quickinput/common/quickInput';

interface LanguageOption extends QuickPickItem {
    value: 'java' | 'kotlin';
}

interface DeviceOption extends QuickPickItem {
    value: 'phone' | 'wear' | 'tv';
}

interface SdkOption extends QuickPickItem {
    value: number;
}

export function registerCreateAppWizard(
    commandService: ICommandService,
    quickInputService: IQuickInputService
) {
    commandService.registerCommand('createApp.wizard', async () => {
        // Step 1: App Name
        const appName = await quickInputService.input({
            prompt: 'Enter your app name',
            placeHolder: 'my_android_app',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'App name cannot be empty';
                }
                if (!/^[a-z][a-z0-9_]*$/.test(value)) {
                    return 'Use lowercase letters, numbers, and underscores only';
                }
                return undefined;
            }
        });

        if (!appName) return;

        // Step 2: Language
        const languageOptions: LanguageOption[] = [
            { label: 'Kotlin', description: 'Recommended for modern Android', value: 'kotlin' },
            { label: 'Java', description: 'Classic Android language', value: 'java' }
        ];

        const selectedLanguage = await quickInputService.pick(languageOptions, {
            placeHolder: 'Select programming language'
        });

        if (!selectedLanguage) return;

        // Step 3: Device Support
        const deviceOptions: DeviceOption[] = [
            { label: '📱 Phone & Tablet', description: 'Standard Android apps', value: 'phone' },
            { label: '⌚ Wear OS', description: 'Smartwatch apps', value: 'wear' },
            { label: '📺 Android TV', description: 'TV apps', value: 'tv' }
        ];

        const selectedDevice = await quickInputService.pick(deviceOptions, {
            placeHolder: 'Select device support'
        });

        if (!selectedDevice) return;

        // Step 4: Minimum Android Version
        const sdkOptions: SdkOption[] = [
            { label: 'Android 5.0 (API 21)', description: 'Supports 90%+ devices', value: 21 },
            { label: 'Android 6.0 (API 23)', description: 'Supports 85%+ devices', value: 23 },
            { label: 'Android 7.0 (API 24)', description: 'Supports 80%+ devices', value: 24 },
            { label: 'Android 8.0 (API 26)', description: 'Supports 70%+ devices', value: 26 },
            { label: 'Android 9.0 (API 28)', description: 'Supports 60%+ devices', value: 28 },
            { label: 'Android 10 (API 29)', description: 'Supports 50%+ devices', value: 29 },
            { label: 'Android 11 (API 30)', description: 'Modern devices', value: 30 },
            { label: 'Android 12 (API 31)', description: 'Latest features', value: 31 },
            { label: 'Android 13 (API 33)', description: 'Latest Android', value: 33 }
        ];

        const selectedSdk = await quickInputService.pick(sdkOptions, {
            placeHolder: 'Select minimum Android version'
        });

        if (!selectedSdk) return;

        // Step 5: Confirm
        const confirm = await quickInputService.confirm({
            message: Create app: ,
            detail: Language: \nDevice: \nMin SDK: ,
            primaryButton: '🚀 Create App'
        });

        if (!confirm) return;

        // Step 6: Create the app using the Android Dev Tools extension
        const packageName = com.example.;

        await commandService.executeCommand('android.openProjectWizard', {
            projectName: appName,
            packageName: packageName,
            language: selectedLanguage.value,
            minSdk: selectedSdk.value,
            device: selectedDevice.value
        });

        commandService.executeCommand('notification.show', {
            message: ✅ App "" created successfully!,
            type: 'info'
        });
    });
}
