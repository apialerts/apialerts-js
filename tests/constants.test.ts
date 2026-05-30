import { describe, expect, it } from 'vitest'
import { INTEGRATION, BASE_URL } from '../src/constants.js'

describe('constants', () => {
    it('integration name is js', () => {
        expect(INTEGRATION).toBe('js')
    })

    it('base url is the apialerts event endpoint', () => {
        expect(BASE_URL).toBe('https://api.apialerts.com/event')
    })
})
