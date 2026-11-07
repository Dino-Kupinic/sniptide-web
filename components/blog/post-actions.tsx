"use client"

import { Menu } from "@base-ui/react/menu"
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FileTextIcon,
  LinkIcon,
  Share2Icon,
} from "lucide-react"
import { type ReactNode, useRef, useState } from "react"
import { track } from "@/lib/tracking"

type Props = {
  title: string
  // The post's address, its Markdown twin (/blog/<slug>.md) and that twin's full address.
  url: string
  markdownPath: string
  markdownUrl: string
}

type Status = "idle" | "copied" | "failed"

// Copies text after a click and reports the result for a moment. The clipboard item takes a
// promise, so Safari keeps the click's permission while the Markdown loads.
function useCopy() {
  const [status, setStatus] = useState<Status>("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  async function copy(text: string | (() => Promise<string>)) {
    clearTimeout(timer.current)
    try {
      if (typeof text === "string") {
        await navigator.clipboard.writeText(text)
      } else {
        const blob = text().then((value) => new Blob([value], { type: "text/plain" }))
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })])
      }
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
    timer.current = setTimeout(() => setStatus("idle"), 2000)
  }
  return { status, copy }
}

// Reports a reader's action on a post as blog_action { action, slug } (lib/tracking.ts).
function report(props: Props, action: string) {
  const slug = new URL(props.url).pathname.split("/").filter(Boolean).pop() ?? ""
  track("blog_action", { action, slug })
}

async function fetchMarkdown(path: string) {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Markdown request failed with ${response.status}`)
  return response.text()
}

function links({ title, url, markdownUrl }: Props) {
  const encoded = encodeURIComponent(url)
  const prompt = encodeURIComponent(`Read ${markdownUrl} so I can ask questions about it.`)
  return {
    x: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encoded}`,
    linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    chatGpt: `https://chatgpt.com/?hints=search&q=${prompt}`,
    claude: `https://claude.ai/new?q=${prompt}`,
  }
}

function CopiedIcon({ status, icon }: { status: Status; icon: ReactNode }) {
  return status === "copied" ? <CheckIcon aria-hidden="true" className="text-highlight" /> : icon
}

// The left rail beside a post on wide screens: two labelled groups of actions, sharing and reading
// the post with an assistant. Each row names what it does.
export function PostRailActions(props: Props) {
  const share = useCopy()
  const markdown = useCopy()
  const href = links(props)
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="share-heading">
        <h2 id="share-heading" className="mb-2 text-sm leading-5 font-medium">
          Share this article
        </h2>
        <ul className="-mx-2.5 flex flex-col">
          <RailRow
            onClick={() => {
              report(props, "copy_link")
              share.copy(props.url)
            }}
            icon={<CopiedIcon status={share.status} icon={<LinkIcon aria-hidden="true" />} />}
          >
            {share.status === "copied" ? "Link copied" : "Copy link"}
          </RailRow>
          <RailRow onClick={() => report(props, "share_x")} href={href.x} icon={<XMark />}>
            Share on X
          </RailRow>
          <RailRow
            onClick={() => report(props, "share_linkedin")}
            href={href.linkedIn}
            icon={<LinkedInMark />}
          >
            Share on LinkedIn
          </RailRow>
        </ul>
      </section>
      <section aria-labelledby="ai-heading">
        <h2 id="ai-heading" className="mb-2 text-sm leading-5 font-medium">
          Read with AI
        </h2>
        <ul className="-mx-2.5 flex flex-col">
          <RailRow
            onClick={() => {
              report(props, "copy_markdown")
              markdown.copy(() => fetchMarkdown(props.markdownPath))
            }}
            icon={<CopiedIcon status={markdown.status} icon={<CopyIcon aria-hidden="true" />} />}
          >
            {markdown.status === "copied" ? "Markdown copied" : "Copy as Markdown"}
          </RailRow>
          <RailRow
            onClick={() => report(props, "open_chatgpt")}
            href={href.chatGpt}
            icon={<OpenAiLogo />}
          >
            Open in ChatGPT
          </RailRow>
          <RailRow
            onClick={() => report(props, "open_claude")}
            href={href.claude}
            icon={<ClaudeLogo />}
          >
            Open in Claude
          </RailRow>
          <RailRow
            onClick={() => report(props, "view_markdown")}
            href={props.markdownPath}
            icon={<FileTextIcon aria-hidden="true" />}
            sameTab
          >
            View as Markdown
          </RailRow>
        </ul>
      </section>
      <Announce statuses={[share.status, markdown.status]} />
    </div>
  )
}

const rowClass =
  "flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-sm leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link [&_svg]:size-4 [&_svg]:shrink-0"

function RailRow({
  icon,
  children,
  href,
  onClick,
  sameTab = false,
}: {
  icon: ReactNode
  children: ReactNode
  href?: string
  onClick?: () => void
  sameTab?: boolean
}) {
  return (
    <li>
      {href ? (
        <a
          href={href}
          onClick={onClick}
          className={`${rowClass} group`}
          {...(sameTab ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        >
          {icon}
          {children}
          {!sameTab && (
            <ArrowUpRightIcon
              aria-hidden="true"
              className="ml-auto size-3.5! opacity-0 transition-opacity group-hover:opacity-100"
            />
          )}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={rowClass}>
          {icon}
          {children}
        </button>
      )}
    </li>
  )
}

function Announce({ statuses }: { statuses: Status[] }) {
  const message = statuses.includes("failed")
    ? "Couldn't copy. Allow clipboard access and try again."
    : statuses.includes("copied")
      ? "Copied"
      : ""
  return (
    <span aria-live="polite" className="sr-only">
      {message}
    </span>
  )
}

const triggerClass =
  "inline-flex h-10 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm leading-5 font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link data-popup-open:bg-muted md:h-8 [&_svg]:size-4 [&_svg]:text-muted-foreground"
const itemClass =
  "flex h-10 cursor-default items-center gap-2.5 rounded-md px-3 md:h-8 text-sm leading-5 outline-none select-none data-highlighted:bg-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
const popupClass =
  "blog min-w-52 origin-(--transform-origin) rounded-lg border bg-popover p-1 text-foreground shadow-(--float-shadow) transition-[opacity,scale] duration-100 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:transition-none"

// The same actions as two menus under the byline, for screens without the side rails.
export function PostActionsBar(props: Props) {
  const share = useCopy()
  const markdown = useCopy()
  const href = links(props)
  return (
    <div className="flex flex-wrap gap-2">
      <Menu.Root>
        <Menu.Trigger className={triggerClass}>
          <Share2Icon aria-hidden="true" />
          Share
          <ChevronDownIcon aria-hidden="true" className="size-3.5!" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={6} align="start" className="z-40 outline-none">
            <Menu.Popup className={popupClass}>
              <Menu.Item
                className={itemClass}
                closeOnClick={false}
                onClick={() => {
                  report(props, "copy_link")
                  share.copy(props.url)
                }}
              >
                <CopiedIcon status={share.status} icon={<LinkIcon aria-hidden="true" />} />
                {share.status === "copied" ? "Link copied" : "Copy link"}
              </Menu.Item>
              <Menu.LinkItem
                href={href.x}
                onClick={() => report(props, "share_x")}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
              >
                <XMark />
                Share on X
              </Menu.LinkItem>
              <Menu.LinkItem
                href={href.linkedIn}
                onClick={() => report(props, "share_linkedin")}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
              >
                <LinkedInMark />
                Share on LinkedIn
              </Menu.LinkItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Menu.Root>
        <Menu.Trigger className={triggerClass}>
          <CopyIcon aria-hidden="true" />
          Read with AI
          <ChevronDownIcon aria-hidden="true" className="size-3.5!" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={6} align="start" className="z-40 outline-none">
            <Menu.Popup className={popupClass}>
              <Menu.Item
                className={itemClass}
                closeOnClick={false}
                onClick={() => {
                  report(props, "copy_markdown")
                  markdown.copy(() => fetchMarkdown(props.markdownPath))
                }}
              >
                <CopiedIcon status={markdown.status} icon={<CopyIcon aria-hidden="true" />} />
                {markdown.status === "copied" ? "Markdown copied" : "Copy as Markdown"}
              </Menu.Item>
              <Menu.LinkItem
                href={href.chatGpt}
                onClick={() => report(props, "open_chatgpt")}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
              >
                <OpenAiLogo />
                Open in ChatGPT
              </Menu.LinkItem>
              <Menu.LinkItem
                href={href.claude}
                onClick={() => report(props, "open_claude")}
                target="_blank"
                rel="noopener noreferrer"
                className={itemClass}
              >
                <ClaudeLogo />
                Open in Claude
              </Menu.LinkItem>
              <Menu.LinkItem
                href={props.markdownPath}
                onClick={() => report(props, "view_markdown")}
                className={itemClass}
              >
                <FileTextIcon aria-hidden="true" />
                View as Markdown
              </Menu.LinkItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Announce statuses={[share.status, markdown.status]} />
    </div>
  )
}

function XMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
    </svg>
  )
}

// Monochrome marks from Lobe Icons (MIT, github.com/lobehub/lobe-icons), as in the docs'
// page actions. They draw in currentColor, so they follow the text colour in light and dark.
function OpenAiLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  )
}

function ClaudeLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  )
}
