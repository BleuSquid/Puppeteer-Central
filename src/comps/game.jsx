import React from 'react'
import { Segment, Tab, Menu } from 'semantic-ui-react'
import { Spacer } from '../comps/tools'
import { useStateLink } from '@hookstate/core'
import ColonistBasicCommands from './ux/colonist-basic-commands'
import ColonistCapacities from './ux/colonist-capacities'
import ColonistCombat from './ux/colonist-combat'
import ColonistMood from './ux/colonist-mood'
import ColonistOverview from './ux/colonist-overview'
import ColonistSchedules from './ux/colonist-schedules'
import ColonistSkills from './ux/colonist-skills'
import ColonistThoughts from './ux/colonist-thoughts'
import ColonistSocials from './ux/colonist-socials'
import ColonistGear from './ux/colonist-gear'
import ColonistInventory from './ux/colonist-inventory'
import TwitchToolkit from './ux/colonist-toolkit'
import GameHeader from './ux/game-header'
import colonist from '../services/cmd_colonist'
import ColonistInjuries from './ux/colonist-injuries'
import game from '../services/cmd_game-info'
import settings from '../services/cmd_settings'
import streamers from '../services/cmd_streamers'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './errorhandler'

export default function Game() {
	const colonistLink = useStateLink(colonist.ref)
	const colonistFlagsLink = useStateLink(colonist.flagsRef)
	const isAvailableLink = useStateLink(colonist.isAvailableRef)
	const gameLink = useStateLink(game.ref)
	const settingsLink = useStateLink(settings.ref)
	const streamersLink = useStateLink(streamers.ref)

	const viewing = settingsLink.value.viewing
	const streamer = viewing ? streamersLink.value.find((s) => s.user.id == viewing.id && s.user.service == viewing.service) : undefined

	const menu = (name, enabled, content) => ({
		menuItem: (
			<Menu.Item key={name}>
				<img src={`/i/tabs/${name}.png`} style={{ width: 24, height: 24, opacity: enabled ? 1 : 0.25 }} />
			</Menu.Item>
		),
		render: () => (enabled ? <div style={{ marginTop: '12px', borderTop: '1px solid lightgray' }}>{content}</div> : undefined),
	})

	let panes = [
		menu('state', true, <ColonistBasicCommands />),
		menu('combat', true, <ColonistCombat />),
		menu('gear', true, <ErrorBoundary FallbackComponent={ErrorFallback}><ColonistGear /></ErrorBoundary>),
		menu('inventory', true, <ErrorBoundary FallbackComponent={ErrorFallback}><ColonistInventory /></ErrorBoundary>),
		menu(
			'injury',
			colonistFlagsLink.value.injuries || colonistFlagsLink.value.capacities,
			<React.Fragment>
				<ColonistInjuries />
				<ColonistCapacities />
			</React.Fragment>
		),
		menu('mood', true, <ColonistMood />),
		menu('mind', colonistFlagsLink.value.thoughts, <ColonistThoughts />),
		menu('social', true, <ColonistSocials />),
		menu('skill', colonistFlagsLink.value.skills, <ColonistSkills />),
		menu('schedule', true, <ErrorBoundary FallbackComponent={ErrorFallback}><ColonistSchedules /></ErrorBoundary>),
		// optional twitch toolkit position
	]

	let toolkit = undefined
	if (gameLink.value.features.indexOf('twitch-toolkit') > -1) {
		if (colonistLink.value.name) toolkit = <TwitchToolkit />
		panes.push(menu('toolkit', true, <TwitchToolkit />))
	}

	return (
		<React.Fragment>
			<GameHeader streamer={streamer} />
			{streamer && (
				<React.Fragment>
					<ColonistOverview />
					{colonistLink.value.name && ((colonistFlagsLink.value.assigned && isAvailableLink.value) || toolkit) && (
						<React.Fragment>
							<Segment.Group>
								<Segment>{colonistFlagsLink.value.assigned && isAvailableLink.value ? <Tab panes={panes} /> : toolkit}</Segment>
							</Segment.Group>
							<Spacer />
						</React.Fragment>
					)}
				</React.Fragment>
			)}
		</React.Fragment>
	)
}
