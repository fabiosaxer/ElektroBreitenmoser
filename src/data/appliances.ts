export interface ApplianceItem {
	slug: string;
	label: string;
	description: string;
}

export interface ApplianceRoom {
	room: string;
	items: ApplianceItem[];
}

export const rooms: ApplianceRoom[] = [
	{
		room: 'Küche',
		items: [
			{
				slug: 'freistehende-gefriergeraete',
				label: 'Freistehende Gefriergeräte',
				description:
					'Freistehende Gefriergeräte lassen sich flexibel platzieren und bieten zusätzlichen Stauraum, wenn ein Einbaugerät nicht infrage kommt oder Ihr Bedarf über die vorhandene Küchenplanung hinausgeht.',
			},
			{
				slug: 'steamer',
				label: 'Steamer',
				description:
					'Ein Steamer gart Gemüse, Fisch und Fleisch schonend mit Dampf – das erhält Vitamine, Farbe und Aroma besser als klassisches Kochen und eignet sich auch zum Regenerieren oder Auftauen.',
			},
			{
				slug: 'backoefen-herde',
				label: 'Backöfen/Herde',
				description:
					'Backöfen und Herde von V-ZUG stehen für präzise Temperaturführung und gleichmässige Hitzeverteilung – von der Alltagsküche bis zum aufwendigen Sonntagsbraten.',
			},
			{
				slug: 'schubladen',
				label: 'Schubladen',
				description:
					'Wärme- und Vakuumschubladen ergänzen Backofen und Kochfeld: Speisen warmhalten, servierfertig halten oder Lebensmittel vakuumieren – praktisch im Alltag und beim Vorbereiten.',
			},
			{
				slug: 'mikrowellen',
				label: 'Mikrowellen',
				description:
					'Mikrowellengeräte erwärmen und tauen schnell auf – als Einbaugerät kombiniert mit weiteren Funktionen wie Grill oder Heissluft eine platzsparende Ergänzung zur Küche.',
			},
			{
				slug: 'kaffeevollautomaten',
				label: 'Einbau-Kaffeevollautomaten',
				description:
					'Ein Einbau-Kaffeevollautomat fügt sich nahtlos in die Küchenzeile ein und liefert auf Knopfdruck frisch gemahlenen Kaffee – ganz ohne separates Gerät auf der Arbeitsfläche.',
			},
			{
				slug: 'kochfelder',
				label: 'Kochfelder',
				description:
					'Kochfelder – ob Induktion oder Glaskeramik – bieten präzise Temperaturregelung und lassen sich leicht reinigen. Wir beraten Sie, welche Bauart zu Ihrer Küche und Ihren Kochgewohnheiten passt.',
			},
			{
				slug: 'kochfelder-dunstabzug',
				label: 'Kochfelder mit Dunstabzug',
				description:
					'Kochfelder mit integriertem Dunstabzug führen Dampf und Gerüche direkt am Kochfeld ab, ganz ohne sichtbare Hutte über der Kochinsel – für ein aufgeräumtes Küchenbild.',
			},
			{
				slug: 'dunstabzuege',
				label: 'Dunstabzüge',
				description:
					'Dunstabzüge halten die Küchenluft frei von Kochdünsten und Gerüchen. Ob als Haube, flach integriert oder als Umluftlösung – wir finden die passende Variante für Ihre Raumsituation.',
			},
			{
				slug: 'geschirrspueler',
				label: 'Geschirrspüler',
				description:
					'V-ZUG Geschirrspüler reinigen zuverlässig bei niedrigem Wasser- und Energieverbrauch und arbeiten dabei angenehm leise – ein Gerät, das im Alltag kaum auffällt, aber viel abnimmt.',
			},
			{
				slug: 'kuehl-gefrierschraenke',
				label: 'Einbau-Kühl- und Gefrierschränke',
				description:
					'Einbau-Kühl- und Gefrierschränke verschwinden hinter der Küchenfront und sorgen dennoch für zuverlässige Kühlung – abgestimmt auf die Masse und Aufteilung Ihrer Küche.',
			},
		],
	},
	{
		room: 'Waschraum',
		items: [
			{
				slug: 'waschmaschinen',
				label: 'Waschmaschinen',
				description:
					'V-ZUG Waschmaschinen reinigen Textilien schonend und effizient – von der Alltagswäsche bis zu empfindlichen Stoffen, die besondere Programme erfordern.',
			},
			{
				slug: 'waeschetrockner',
				label: 'Wäschetrockner',
				description:
					'Wäschetrockner sparen Zeit und schonen die Wäsche zugleich. Wir beraten Sie, welche Trocknertechnologie zu Ihrem Waschraum und Ihrem Wäscheaufkommen passt.',
			},
			{
				slug: 'waschtuerme',
				label: 'Waschtürme',
				description:
					'Ein Waschturm stapelt Waschmaschine und Trockner platzsparend übereinander – ideal für kleinere Waschräume, ohne bei Kapazität oder Komfort Abstriche zu machen.',
			},
		],
	},
];
