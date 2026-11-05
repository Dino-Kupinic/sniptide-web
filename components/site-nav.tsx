"use client"

import { Accordion } from "@base-ui/react/accordion"
import { NavigationMenu } from "@base-ui/react/navigation-menu"
import { cn } from "@sniptide/ui/lib/utils"
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react"
import type { CSSProperties } from "react"
import { type NavItem, type NavMenu, navLinks, navMenus } from "@/lib/nav"

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

function MenuPanel({ menu }: { menu: NavMenu }) {
  const columns = menu.groups.length
  return (
    <div
      className={cn(
        "grid gap-1 p-1.5",
        columns > 1 ? "w-[42rem] grid-cols-2" : "w-[25rem] grid-cols-1",
      )}
    >
      {menu.groups.map((group) => (
        <div key={group.label ?? menu.label} className="flex min-w-0 flex-col">
          {group.label && (
            <p className={cn("px-2 pt-1.5 pb-1 text-xs leading-4", muted)}>{group.label}</p>
          )}
          <ul className="flex flex-col">
            {group.items.map((item) => (
              <li key={item.label}>
                <MenuRow item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// The new panel slides in from the side of the trigger it belongs to while the popup resizes.
const content =
  "transition-[opacity,translate] duration-(--duration) ease-(--easing) data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-6 data-starting-style:data-[activation-direction=right]:translate-x-6 data-ending-style:data-[activation-direction=left]:translate-x-6 data-ending-style:data-[activation-direction=right]:-translate-x-6 motion-reduce:transition-none"

export function DesktopNav() {
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
            Its ::before bridges the gap to the trigger so the pointer can cross it. */}
        <NavigationMenu.Positioner
          data-cta-location="header"
          side="bottom"
          align="start"
          sideOffset={20}
          collisionPadding={20}
          collisionAvoidance={{ side: "none" }}
          className="z-40 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) before:absolute before:inset-x-0 before:-top-5 before:h-5 before:content-[''] data-instant:transition-none motion-reduce:transition-none"
          style={
            {
              "--duration": "0.25s",
              "--easing": "cubic-bezier(0.22, 1, 0.36, 1)",
            } as CSSProperties
          }
        >
          <NavigationMenu.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg border border-[#e8e8e8] bg-white text-[#0a0a0a] shadow-(--float-shadow) outline-none transition-[opacity,scale,width,height] duration-(--duration) ease-(--easing) data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-out motion-reduce:transition-none dark:border-[#262626] dark:bg-[#0c0b0b] dark:text-white">
            <NavigationMenu.Viewport className="relative size-full overflow-hidden rounded-[inherit]" />
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
                <div key={group.label ?? menu.label}>
                  {group.label && (
                    <p className={cn("pt-2 pb-1 text-xs leading-4", muted)}>{group.label}</p>
                  )}
                  <ul>
                    {group.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.label}>
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
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
