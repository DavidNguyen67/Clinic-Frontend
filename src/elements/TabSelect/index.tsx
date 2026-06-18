"use client";

import { useState } from "react";
import { Tab, TabList, TabGroup, TabPanel, TabPanels } from "@headlessui/react";

import clsx from "clsx";

import type { ReactNode } from "react";

type Props = {
  listTabs: { id: number; name: string; component: ReactNode }[];
  className?: string;
  listTabsClassName?: string;
  tabPanelsClassName?: string;
};

const TabSelect = (props: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <TabGroup
      className={clsx("flex-1 h-full flex flex-col overflow-hidden", props?.className)}
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    >
      <TabList className="flex w-full flex-row justify-between">
        <div
          className={`flex-1 flex flex-row items-center gap-[1.6rem] ${
            props.listTabsClassName ?? ""
          }`}
        >
          {props.listTabs.map((tab, index) => (
            <Tab
              key={tab.id}
              className={`${
                selectedIndex === index
                  ? "bg-active-tab text-[var(--text-3)]"
                  : "text-[var(--text-7)] bg-[var(--bg-item)]"
              } px-[1.2rem] py-[0.8rem] rounded-[0.8rem] text-[1.4rem] font-500 border-none cursor-pointer outline-none`}
            >
              {tab.name}
            </Tab>
          ))}
        </div>
      </TabList>
      <TabPanels className={`flex flex-1 ${props?.tabPanelsClassName}`}>
        {props.listTabs.map((tab, index) => (
          <TabPanel key={tab.id} className="flex-1 h-full">
            {tab.component}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default TabSelect;
