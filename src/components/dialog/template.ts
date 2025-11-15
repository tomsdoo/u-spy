import { CodeEditorElement } from "@/components/code-editor";
import { CustomFormElement } from "@/components/custom-form";
import { KeyHelpElement } from "@/components/key-help";
import { LogFormElement } from "@/components/log/form";
import { StyleEditorElement } from "@/components/style-editor";

export enum DialogType {
  LOG_LIST = "log-list",
  STYLE_EDITOR = "style-editor",
  CODE_EDITOR = "code-editor",
  CUSTOM_FORM = "custom-form",
}

export async function template({
  id,
  dialogType,
  shadowHostStyle,
}: {
  id: string;
  dialogType: DialogType;
  shadowHostStyle: string;
}) {
  return `
    <div id="${id}">
      ${
        ({
          [DialogType.LOG_LIST]: `<${LogFormElement.TAG_NAME}></${LogFormElement.TAG_NAME}>`,
          [DialogType.STYLE_EDITOR]: `<${StyleEditorElement.TAG_NAME}></${StyleEditorElement.TAG_NAME}>`,
          [DialogType.CODE_EDITOR]: `<${CodeEditorElement.TAG_NAME}></${CodeEditorElement.TAG_NAME}>`,
          [DialogType.CUSTOM_FORM]: `<${CustomFormElement.TAG_NAME}></${CustomFormElement.TAG_NAME}>`,
        })[dialogType] ?? ""
      }
      <${KeyHelpElement.TAG_NAME} role="dialog" visible="false" tabindex="-1" :key-definitions="[]"></${KeyHelpElement.TAG_NAME}>
    </div>
    <style>
    ${shadowHostStyle}
    #${id} {
      position: fixed;
      display: grid;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgb(0 0 0 / 80%);
      z-index: calc(infinity);

      ${LogFormElement.TAG_NAME},
      ${StyleEditorElement.TAG_NAME},
      ${CodeEditorElement.TAG_NAME},
      ${CustomFormElement.TAG_NAME} {
        background: transparent;
        color: inherit;
      }

      ul,
      ol {
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        list-style-type: none;
      }

      > [role="dialog"] {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: transparent;
        color: inherit;

        &[visible="false"] {
          display: none;
        }
      }
    }
    </style>
  `;
}
