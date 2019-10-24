import Web3 from 'web3'
import {
	createMarketContract,
	createSchemaCaller,
	CreateMarketContract
} from './market'
import { CustomOptions } from './option'
import { marketAbi } from './market-abi'

describe('market.ts', () => {
	describe('createMarketContract', () => {
		it('check return object', () => {
			const host = 'localhost'
			const client = new Web3()
			client.setProvider(new Web3.providers.HttpProvider(host))

			const expected: (
				address?: string,
				options?: CustomOptions
			) => CreateMarketContract = (
				address?: string,
				options?: CustomOptions
			) => {
				const marketContract = new client.eth.Contract(marketAbi, address, {
					...options
				})
				return {
					schema: createSchemaCaller(marketContract)
				}
			}

			const result = createMarketContract(client)

			expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
		})
	})
})
