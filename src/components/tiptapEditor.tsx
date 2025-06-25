import { Box, Flex, Separator } from "@radix-ui/themes";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ItalicIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export default function TipTapEditor({
  content,
  setContent,
  isLoading,
}: {
  content?: string;
  setContent?: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading?: boolean;
}) {
  const headings = [
    {
      value: "1",
      label: "Heading 1",
      icon: Heading1,
    },
    {
      value: "2",
      label: "Heading 2",
      icon: Heading2,
    },
    {
      value: "3",
      label: "Heading 3",
      icon: Heading3,
    },
    {
      value: "4",
      label: "Heading 4",
      icon: Heading4,
    },
    {
      value: "5",
      label: "Heading 5",
      icon: Heading5,
    },
    {
      value: "6",
      label: "Heading 6",
      icon: Heading6,
    },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "w-full !my-1 text-black",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "w-full !my-1 text-black",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "w-full !my-1 text-black",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "w-full !my-1 text-black",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "w-full !my-1 text-black",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "right", "center", "justify"],
        defaultAlignment: "left",
      }),
      Underline,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "focus:!border-none focus:!outline-none min-h-[100px] max-h-[300px] h-full w-full overflow-auto",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent?.(html);
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      editor.commands.setContent(content, false); // false = no history record
    }
  }, [editor, content]);

  return (
    <Card className="p-0 gap-0 relative">
      {isLoading && (
        <Box className="pointer-events-none cursor-not-allowed opacity-50 bg-white z-30 absolute top-0 left-0 w-full h-full rounded-lg"></Box>
      )}
      <Flex
        align={{ initial: "start", md: "center" }}
        direction={{ initial: "column", md: "row" }}
        className="space-x-3 py-1"
      >
        <Flex align={{ initial: "center" }} className="space-x-3">
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              data-state={editor?.isActive("bold") ? "on" : "off"}
              value="bold"
              aria-label="Toggle bold"
              onClick={() => editor?.commands.toggleBold()}
            >
              <BoldIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={editor?.isActive("italic") ? "on" : "off"}
              value="italic"
              aria-label="Toggle italic"
              onClick={() => editor?.commands.toggleItalic()}
            >
              <ItalicIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={editor?.isActive("underline") ? "on" : "off"}
              value="underline"
              aria-label="Toggle underline"
              onClick={() => editor?.chain().focus().setUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation={"vertical"} />
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              data-state={
                editor?.isActive({ textAlign: "left" }) ? "on" : "off"
              }
              value="align left"
              aria-label="Toggle align left"
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={
                editor?.isActive({ textAlign: "center" }) ? "on" : "off"
              }
              value="align center"
              aria-label="Toggle align center"
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={
                editor?.isActive({ textAlign: "right" }) ? "on" : "off"
              }
              value="align right"
              aria-label="Toggle align right"
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
            >
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={
                editor?.isActive({ textAlign: "justify" }) ? "on" : "off"
              }
              value="align justify"
              aria-label="Toggle align justify"
              onClick={() =>
                editor?.chain().focus().setTextAlign("justify").run()
              }
            >
              <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation={"vertical"} />
        </Flex>
        <Flex align={{ initial: "center" }} className="space-x-3">
          <ToggleGroup type="multiple">
            <ToggleGroupItem
              data-state={editor?.isActive("bulletList") ? "on" : "off"}
              value="bulletList"
              aria-label="Toggle bulletList"
              onClick={() => editor?.commands.toggleBulletList()}
            >
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={editor?.isActive("orderedList") ? "on" : "off"}
              value="orderedList"
              aria-label="Toggle orderedList"
              onClick={() => editor?.commands.toggleOrderedList()}
            >
              <ListOrdered className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              data-state={editor?.isActive("blockquote") ? "on" : "off"}
              value="blockquote"
              aria-label="Toggle blockquote"
              onClick={() => editor?.commands.toggleBlockquote()}
            >
              <Quote className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation={"vertical"} />
          <Select
            value={
              editor?.isActive("paragraph")
                ? "paragraph"
                : headings.find((h) =>
                    editor?.isActive("heading", { level: Number(h.value) })
                  )?.value
            }
            onValueChange={(e: any) =>
              e == "paragraph"
                ? editor?.commands.setParagraph()
                : editor?.commands.setHeading({ level: Number(e) as Level })
            }
          >
            <SelectTrigger className="max-w-[180px] w-full" size="sm">
              <SelectValue placeholder="Select heading" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="paragraph">
                  <Pilcrow /> Paragraph
                </SelectItem>
                {headings.map((heading) => (
                  <SelectItem value={heading.value} key={heading.value}>
                    <heading.icon /> {heading.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Flex>
      </Flex>
      <Separator className="!w-full" />
      <CardContent className="prose p-2 !max-w-full">
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
}
