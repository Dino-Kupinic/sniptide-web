"use client"

import { Accordion } from "@base-ui/react/accordion"
import { NavigationMenu } from "@base-ui/react/navigation-menu"
import { cn } from "@sniptide/ui/lib/utils"
import { ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import type { CSSProperties, RefObject } from "react"
import { type NavFeature, type NavItem, type NavMenu, navLinks, navMenus } from "@/lib/nav"

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

// One row of a desktop menu: a 36px tile with the icon, the name and one line on what it does.
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
          "flex size-9 shrink-0 items-center justify-center rounded-md border border-[#e8e8e8] bg-white transition-colors group-hover/row:text-[#2a26ec] group-focus-visible/row:text-[#2a26ec] dark:border-[#2f2c2c] dark:bg-[#121111] dark:group-hover/row:text-[#8f8cff] dark:group-focus-visible/row:text-[#8f8cff]",
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

// The last column: a filled panel with one link, a sentence and the action it leads to.
function FeatureCard({ feature }: { feature: NavFeature }) {
  const Icon = feature.icon
  return (
    <NavigationMenu.Link
      href={feature.href}
      closeOnClick
      {...linkTarget(feature)}
      className="group/feature flex h-full flex-col gap-3 rounded-lg bg-[#f4f4f4] p-5 outline-none transition-colors hover:bg-[#ededed] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2a26ec] dark:bg-[#1a1919] dark:hover:bg-[#211f1f] dark:focus-visible:outline-[#8f8cff]"
    >
      <Icon className="size-4 text-[#2a26ec] dark:text-[#8f8cff]" />
      <span className="flex flex-col gap-1">
        <span className="text-sm leading-5 font-medium text-[#0a0a0a] dark:text-white">
          {feature.label}
        </span>
        <span className={cn("text-[13px] leading-[18px]", muted)}>{feature.description}</span>
      </span>
      <span className="mt-auto inline-flex items-center gap-1 text-sm leading-5 font-medium text-[#2a26ec] dark:text-[#8f8cff]">
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
    </NavigationMenu.Link>
  )
}

// A full-width panel under the header: one column per group, then the feature card. The columns
// start at the header's gutter, under the logo.
function MenuPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-[repeat(2,minmax(0,23rem))_minmax(0,1fr)_minmax(0,20rem)] gap-8 px-10 pt-6 pb-8">
      {menu.groups.map((group) => (
        <div key={group.label} className="flex min-w-0 flex-col gap-1">
          <p className={cn("pb-1 text-xs leading-4", muted)}>{group.label}</p>
          <ul className="-mx-2 flex flex-col">
            {group.items.map((item) => (
              <li key={item.label}>
                <MenuRow item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="col-start-4 min-w-0">
        <FeatureCard feature={menu.feature} />
      </div>
    </div>
  )
}

// The new panel slides in from the side of the trigger it belongs to while the popup resizes.
const content =
  "transition-[opacity,translate] duration-(--duration) ease-(--easing) data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-6 data-starting-style:data-[activation-direction=right]:translate-x-6 data-ending-style:data-[activation-direction=left]:translate-x-6 data-ending-style:data-[activation-direction=right]:-translate-x-6 motion-reduce:transition-none"

// The menus open as one panel the width of the header, attached to its bottom edge.
export function DesktopNav({ anchor }: { anchor: RefObject<HTMLElement | null> }) {
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
              <MenuPanel menu={menu} />
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
