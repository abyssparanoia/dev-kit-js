import Web3 from 'web3'
import { propertyFactoryAbi } from './abi'
import { createCreatePropertyCaller } from './createProperty'
import { CustomOptions } from '../option'

describe('createProperty.spec.ts', () => {
	describe('createCreatePropertyCaller', () => {
		it('check return value', () => {
			const host = 'localhost'
			const client = new Web3()
			client.setProvider(new Web3.providers.HttpProvider(host))

			// example address
			const address = '0x0472ec0185ebb8202f3d4ddb0226998889663cf2'
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const options = ({} as any) as CustomOptions

			const propertyFactoryContract = new client.eth.Contract(
				propertyFactoryAbi,
				address,
				{
					...options
				}
			)

			const expected: (
				name: string,
				symbol: string
			) => Promise<string> = async (name: string, symbol: string) =>
				propertyFactoryContract.methods
					.createProperty([name, symbol])
					.call()
					.then(result => result as string)

			const result = createCreatePropertyCaller(propertyFactoryContract)

			expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
		})

		it('call success', async () => {
			const value = '0x0472ec0185ebb8202f3d4ddb0226998889663cf2'
			const name = 'hoge'
			const symbol = 'symbol'

			const propertyFactoryContract = {
				methods: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					createProperty: (name: string, symbol: string) => ({
						call: jest
							.fn()
							.mockImplementation(async () => Promise.resolve(value))
					})
				}
			}

			const expected = value

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const caller = createCreatePropertyCaller(propertyFactoryContract as any)

			const result = await caller(name, symbol)

			expect(result).toEqual(expected)
		})

		it('call failure', async () => {
			const error = 'error'
			const name = 'hoge'
			const symbol = 'symbol'

			const propertyFactoryContract = {
				methods: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					createProperty: (name: string, symbol: string) => ({
						call: jest
							.fn()
							.mockImplementation(async () => Promise.reject(error))
					})
				}
			}

			const expected = error

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const caller = createCreatePropertyCaller(propertyFactoryContract as any)

			const result = await caller(name, symbol).catch(err => err)

			expect(result).toEqual(expected)
		})
	})
})
