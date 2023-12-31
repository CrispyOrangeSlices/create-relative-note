import { App, MarkdownView, Modal, Plugin, PluginSettingTab, Setting} from 'obsidian';

export default class RelativeNotePlugin extends Plugin {
	async onload() {
		
		this.addCommand({
			id: 'create-note-relative',
			name: 'Create Relative Note',
			hotkeys: [{key:'m', modifiers: ['Ctrl']}],
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						const { vault } = this.app;
						const note_path = markdownView.file?.parent?.path;
						
						if (note_path) {
							new RelativeNoteModal(this.app, note_path, (result) => {
								const note_name = note_path + "/" + result + ".md";
								vault.create(note_name, "");
							}).open();
						}
					}
					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

}

class RelativeNoteModal extends Modal {
	note_path: string;
	result: string;
	onSubmit: (result: string) => void;

	constructor(app: App, note_path: string, onSubmit: (result: string) => void) {
		super(app);
		this.note_path = note_path;
		this.onSubmit = onSubmit;

	}

	onOpen() {
		const {contentEl} = this;

		new Setting(contentEl)
	      .setName("Note Name:")
		  .addText((text) =>
			text.onChange((value) => {
				this.result = value
			}));

	    new Setting(contentEl)
		  .addButton((btn) =>
			btn
	        .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
		}));
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

