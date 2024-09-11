"use client";

import React from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const Sidebar = () => {
	return (
		<div>
			<NavigationMenu>
				<NavigationMenuList className="flex-col items-start space-x-0">
					<NavigationMenuItem>Item One</NavigationMenuItem>
					<NavigationMenuItem>Item Two</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
};

export default Sidebar;
