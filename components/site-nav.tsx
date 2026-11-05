"use client"

import { Accordion } from "@base-ui/react/accordion"
import { NavigationMenu } from "@base-ui/react/navigation-menu"
import { cn } from "@sniptide/ui/lib/utils"
import { ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import type { CSSProperties, RefObject } from "react"
import { CopyButton, FeatureVisual } from "@/components/nav-visuals"
import {
  type NavFeature,
  type NavItem,
  type NavMenu,
  type NavStrip,
  navLinks,
  navMenus,
} from "@/lib/nav"

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
export const navLink =
  "flex h-8 items-center rounded-md px-3 text-sm leading-5 font-medium text-[#4a4747] transition-colors hover:bg-[#f4f4f4] hover:text-[#0a0a0a] dark:text-[#b0b0b0] dark:hover:bg-[#1c1c1c] dark:hover:text-white"
const muted = "text-[#6b6b6b] dark:text-[#a3a3a3]"

function linkTarget(item: NavItem) {
  return item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}
}

function ExternalMark() {
  return (
    <>
      <ArrowUpRightIcon aria-hidden="true" className={cn("size-3.5 shrink-0", muted)} />
      <span className="sr-only">(opens in a new tab)</span>
    </>
  )
}

const hairline = "border-[#e8e8e8] dark:border-[#262626]"

// One row of a desktop menu: a 36px tile with the icon, the name and one line on what it does.
// The tile fills with blue while the row is hovered or focused.
function MenuRow({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavigationMenu.Link
      href={item.href}
      closeOnClick
      {...linkTarget(item)}
      className="group/row flex items-center gap-3 rounded-md p-2 outline-none transition-colors hover:bg-[#f4f4f4] focus-visible:bg-[#f4f4f4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2a26ec] dark:hover:bg-[#1c1c1c] dark:focus-visible:bg-[#1c1c1c] dark:focus-visible:outline-[#8f8cff]"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md border bg-white transition-colors duration-150 group-hover/row:border-[#2a26ec] group-hover/row:bg-[#2a26ec] group-hover/row:text-white group-focus-visible/row:border-[#2a26ec] group-focus-visible/row:bg-[#2a26ec] group-focus-visible/row:text-white dark:bg-[#121111]",
          hairline,
          muted,
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-1 text-sm leading-5 font-medium text-[#0a0a0a] dark:text-white">
          {item.label}
          {item.external && <ExternalMark />}
        </span>
        <span className={cn("text-[13px] leading-[18px]", muted)}>{item.description}</span>
      </span>
    </NavigationMenu.Link>
  )
}

// The last column: a picture of the real thing, then the link's name, a sentence and its action.
function FeatureCard({ feature, stars }: { feature: NavFeature; stars: string | null }) {
  return (
    <NavigationMenu.Link
      href={feature.href}
      closeOnClick
      {...linkTarget(feature)}
      className={cn(
        "group/feature flex h-full flex-col overflow-hidden rounded-lg border bg-white outline-none transition-colors hover:border-[#d0d0d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:bg-[#121111] dark:hover:border-[#3a3737] dark:focus-visible:outline-[#8f8cff]",
        hairline,
      )}
    >
      <FeatureVisual visual={feature.visual} stars={stars} />
      <span className="flex flex-1 flex-col gap-1 p-5">
        <span className="text-sm leading-5 font-medium text-[#0a0a0a] dark:text-white">
          {feature.label}
        </span>
        <span className={cn("text-[13px] leading-[18px]", muted)}>{feature.description}</span>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm leading-5 font-medium text-[#2a26ec] dark:text-[#8f8cff]">
          {feature.action}
          {feature.external ? (
            <>
              <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </>
          ) : (
            <ArrowRightIcon
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 ease-out group-hover/feature:translate-x-0.5 motion-reduce:transition-none"
            />
          )}
        </span>
      </span>
    </NavigationMenu.Link>
  )
}

// The line under the columns: one identifier to copy, such as the install command.
function MenuStrip({ strip }: { strip: NavStrip }) {
  return (
    <div className={cn("col-span-2 flex h-14 min-w-0 items-center gap-3 border-t px-4", hairline)}>
      <span className={cn("shrink-0 text-[13px] leading-[18px]", muted)}>{strip.label}</span>
      {strip.href ? (
        <a
          href={strip.href}
          className="min-w-0 truncate rounded-sm font-mono text-[13px] leading-[18px] text-[#2a26ec] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:text-[#8f8cff] dark:focus-visible:outline-[#8f8cff]"
        >
          {strip.value}
        </a>
      ) : (
        <code className="min-w-0 truncate rounded-md bg-[#f4f4f4] px-2 py-1 font-mono text-[13px] leading-[18px] text-[#0a0a0a] dark:bg-[#1c1c1c] dark:text-white">
          {strip.value}
        </code>
      )}
      <CopyButton value={strip.value} label={strip.label.toLowerCase()} />
    </div>
  )
}

// A full-width panel under the header, laid out on hairline columns inside the 1440px frame: one
// column per group with its name on top, the featured card on the right and the copy strip
// under the groups.
function MenuPanel({ menu, stars }: { menu: NavMenu; stars: string | null }) {
  return (
    <div className="mx-auto max-w-[1440px] px-10">
      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,24rem)] grid-rows-[1fr_auto] border-x",
          hairline,
        )}
      >
        {menu.groups.map((group, index) => (
          <section
            key={group.label}
            className={cn("row-start-1 flex min-w-0 flex-col", index > 0 && "border-l", hairline)}
          >
            <h3
              className={cn(
                "flex h-11 items-center border-b px-4 text-[13px] leading-[18px] font-medium text-[#0a0a0a] dark:text-white",
                hairline,
              )}
            >
              {group.label}
            </h3>
            <ul className="flex flex-col gap-0.5 p-2 pb-4">
              {group.items.map((item) => (
                <li key={item.label}>
                  <MenuRow item={item} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div className={cn("col-start-3 row-span-2 row-start-1 min-w-0 border-l p-3", hairline)}>
          <FeatureCard feature={menu.feature} stars={stars} />
        </div>
        <MenuStrip strip={menu.strip} />
      </div>
    </div>
  )
}

// The new panel slides in from the side of the trigger it belongs to while the popup resizes.
const content =
  "transition-[opacity,translate] duration-(--duration) ease-(--easing) data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-6 data-starting-style:data-[activation-direction=right]:translate-x-6 data-ending-style:data-[activation-direction=left]:translate-x-6 data-ending-style:data-[activation-direction=right]:-translate-x-6 motion-reduce:transition-none"

// The menus open as one panel the width of the header, attached to its bottom edge.
export function DesktopNav({
  anchor,
  stars,
}: {
  anchor: RefObject<HTMLElement | null>
  stars: string | null
}) {
  return (
    <NavigationMenu.Root aria-label="Main navigation" className="-ml-3 hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-1 whitespace-nowrap">
        {navMenus.map((menu) => (
          <NavigationMenu.Item key={menu.label}>
            <NavigationMenu.Trigger
              className={cn(
                navLink,
                "gap-1 data-popup-open:bg-[#f4f4f4] data-popup-open:text-[#0a0a0a] dark:data-popup-open:bg-[#1c1c1c] dark:data-popup-open:text-white",
                focusRing,
              )}
            >
              {menu.label}
              <NavigationMenu.Icon className="transition-transform duration-200 ease-out data-popup-open:rotate-180 motion-reduce:transition-none">
                <ChevronDownIcon aria-hidden="true" className="size-3.5" strokeWidth={2} />
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className={content}>
              <MenuPanel menu={menu} stars={stars} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
        {navLinks.map((link) => (
          <NavigationMenu.Item key={link.label}>
            <NavigationMenu.Link href={link.href} className={cn(navLink, focusRing)}>
              {link.label}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        {/* The popup renders outside the header, so it carries the header's tracking location.
            Its ::before covers the header below the triggers so the pointer can cross it. */}
        <NavigationMenu.Positioner
          anchor={anchor}
          data-cta-location="header"
          side="bottom"
          align="start"
          sideOffset={-1}
          collisionPadding={0}
          collisionAvoidance={{ side: "none" }}
          className="z-40 h-(--positioner-height) w-(--anchor-width) before:absolute before:inset-x-0 before:-top-4 before:h-4 before:content-['']"
          style={
            {
              "--duration": "0.25s",
              "--easing": "cubic-bezier(0.22, 1, 0.36, 1)",
            } as CSSProperties
          }
        >
          <NavigationMenu.Popup className="relative h-(--popup-height) w-full origin-top overflow-hidden border-y border-[#e8e8e8] bg-white text-[#0a0a0a] shadow-(--float-shadow) outline-none transition-[opacity,height] duration-(--duration) ease-(--easing) data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-out motion-reduce:transition-none dark:border-[#222222] dark:bg-[#0a0a0a] dark:text-white">
            <NavigationMenu.Viewport className="relative size-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}

// Mobile menu rows: 48px touch targets on a hairline, the label in ink.
export const menuRow =
  "flex h-12 items-center gap-3 border-b border-[#e8e8e8] text-base leading-6 font-medium text-[#0a0a0a] transition-colors active:text-[#6b6b6b] dark:border-[#222222] dark:text-white dark:active:text-[#a3a3a3]"
// Rows and actions rise 4px into place one after another as the menu opens.
export const menuItem =
  "translate-y-1 opacity-0 transition-[opacity,translate] duration-200 ease-out group-data-open:translate-y-0 group-data-open:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"

export function staggerStyle(open: boolean, index: number): CSSProperties {
  return { transitionDelay: open ? `${index * 30}ms` : "0ms" }
}

function MobileRow({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <a
      href={item.href}
      {...linkTarget(item)}
      className={cn(
        "flex h-11 items-center gap-3 text-sm leading-5 text-[#0a0a0a] transition-colors active:text-[#6b6b6b] dark:text-white dark:active:text-[#a3a3a3]",
        focusRing,
      )}
    >
      <Icon className={cn("size-4 shrink-0", muted)} />
      {item.label}
      {item.external && <ExternalMark />}
    </a>
  )
}

// The same menus as the desktop header, as sections that fold open one at a time.
export function MobileNavMenus({ open }: { open: boolean }) {
  return (
    <Accordion.Root>
      {navMenus.map((menu, index) => (
        <Accordion.Item key={menu.label} className={menuItem} style={staggerStyle(open, index)}>
          <Accordion.Header className="m-0">
            <Accordion.Trigger
              className={cn(menuRow, "group/trigger w-full justify-between text-left", focusRing)}
            >
              {menu.label}
              <ChevronDownIcon
                aria-hidden="true"
                className={cn(
                  "size-4 transition-transform duration-200 ease-out group-data-panel-open/trigger:rotate-180 motion-reduce:transition-none",
                  muted,
                )}
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
            <div className="border-b border-[#e8e8e8] py-2 dark:border-[#222222]">
              {menu.groups.map((group) => (
                <div key={group.label}>
                  <p className={cn("pt-2 pb-1 text-xs leading-4", muted)}>{group.label}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <MobileRow item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-2 border-t border-[#e8e8e8] pt-2 dark:border-[#222222]">
                <MobileRow item={menu.feature} />
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
