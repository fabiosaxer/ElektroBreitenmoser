export interface ApplianceItem {
	slug: string;
	label: string;
}

export interface ApplianceRoom {
	room: string;
	items: ApplianceItem[];
}

export const rooms: ApplianceRoom[] = [
	{
		room: 'Küche',
		items: [
			{ slug: 'freistehende-gefriergeraete', label: 'Freistehende Gefriergeräte' },
			{ slug: 'steamer', label: 'Steamer' },
			{ slug: 'backoefen-herde', label: 'Backöfen/Herde' },
			{ slug: 'schubladen', label: 'Schubladen' },
			{ slug: 'mikrowellen', label: 'Mikrowellen' },
			{ slug: 'kaffeevollautomaten', label: 'Einbau-Kaffeevollautomaten' },
			{ slug: 'kochfelder', label: 'Kochfelder' },
			{ slug: 'kochfelder-dunstabzug', label: 'Kochfelder mit Dunstabzug' },
			{ slug: 'dunstabzuege', label: 'Dunstabzüge' },
			{ slug: 'geschirrspueler', label: 'Geschirrspüler' },
			{ slug: 'kuehl-gefrierschraenke', label: 'Einbau-Kühl- und Gefrierschränke' },
		],
	},
	{
		room: 'Waschküche',
		items: [
			{ slug: 'waschmaschinen', label: 'Waschmaschinen' },
			{ slug: 'waeschetrockner', label: 'Wäschetrockner' },
			{ slug: 'waschtuerme', label: 'Waschtürme' },
		],
	},
];
