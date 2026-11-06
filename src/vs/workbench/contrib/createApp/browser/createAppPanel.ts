import { Disposable } from 'vs/base/common/lifecycle';
import { IViewPaneOptions, ViewPane } from 'vs/workbench/browser/parts/views/viewPane';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IViewRegistry, Extensions as ViewExtensions, ViewContainer } from 'vs/workbench/common/views';
import { Registry } from 'vs/platform/registry/common/platform';

export class CreateAppPanel extends ViewPane {
    constructor(
        options: IViewPaneOptions,
        @IKeybindingService keybindingService: IKeybindingService,
        @IContextMenuService contextMenuService: IContextMenuService,
        @IInstantiationService instantiationService: IInstantiationService,
        @ITelemetryService telemetryService: ITelemetryService,
        @IThemeService themeService: IThemeService,
        @ICommandService private readonly commandService: ICommandService
    ) {
        super(options, keybindingService, contextMenuService, instantiationService, telemetryService, themeService);
    }

    protected renderBody(container: HTMLElement): void {
        container.style.cssText = 
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        ;

        container.innerHTML = 
            <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #fff;">🚀 Create App</h3>
            <p style="color: #888; font-size: 13px; margin: 0 0 20px 0;">
                Start a new Android app in seconds
            </p>
            <button id="createAppPanelBtn" style="
                background: #0078D4;
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 15px;
                border-radius: 6px;
                cursor: pointer;
                width: 100%;
                font-weight: bold;
            ">
                📱 Create App
            </button>
            <div style="margin-top: 15px; font-size: 11px; color: #666; line-height: 1.6;">
                <div>📱 Phone & Tablet</div>
                <div>⌚ Wear OS</div>
                <div>📺 Android TV</div>
                <div style="margin-top: 8px; color: #555;">
                    Java • Kotlin • Flutter
                </div>
            </div>
        ;

        document.getElementById('createAppPanelBtn')?.addEventListener('click', () => {
            this.commandService.executeCommand('createApp.wizard');
        });
    }
}

// Register the view panel
const viewRegistry = Registry.as<IViewRegistry>(ViewExtensions.Views);
viewRegistry.registerView('createApp.panel', {
    id: 'createApp.panel',
    name: 'Create App',
    container: ViewContainer.Explorer,
    ctor: CreateAppPanel,
    canToggleVisibility: true,
    weight: 20
});
