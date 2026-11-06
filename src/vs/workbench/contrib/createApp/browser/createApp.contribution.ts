import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from 'vs/workbench/common/contributions';
import { LifecyclePhase } from 'vs/workbench/services/lifecycle/common/lifecycle';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IQuickInputService } from 'vs/platform/quickinput/common/quickInput';
import { registerCreateAppWizard } from './createAppWizard';
import { IStatusbarService } from 'vs/workbench/services/statusbar/common/statusbar';

class CreateAppContribution {
    constructor(
        @ICommandService commandService: ICommandService,
        @IQuickInputService quickInputService: IQuickInputService,
        @IStatusbarService statusbarService: IStatusbarService
    ) {
        registerCreateAppWizard(commandService, quickInputService);

        // Add status bar button
        const button = statusbarService.addEntry({
            text: ' Create App',
            tooltip: 'Create a new Android app',
            command: 'createApp.wizard'
        }, 'status.createApp', 'Create App');

        button.show();
    }
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
    .registerWorkbenchContribution(CreateAppContribution, LifecyclePhase.Ready);
