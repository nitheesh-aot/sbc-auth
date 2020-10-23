import { Wrapper, createLocalVue, mount } from '@vue/test-utils'
import PADInfoForm from '@/components/auth/common/PADInfoForm.vue'
import UserModule from '@/store/modules/user'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

jest.mock('@/services/document.services')

Vue.use(Vuetify)
Vue.use(VueRouter)

describe('PADInfoForm.vue', () => {
  let wrapper: any
  let wrapperFactory: any

  const app = document.createElement('div')
  app.setAttribute('data-app', 'true')
  document.body.append(app)

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Vuetify)

    const config = {
      'VUE_APP_ROOT_API': 'https://localhost:8080/api/v1/11',
      'VUE_APP_AUTH_ROOT_API': 'https://auth-api-dev.pathfinder.gov.bc.ca/api/v1'
    }

    sessionStorage.__STORE__['AUTH_API_CONFIG'] = JSON.stringify(config)

    const vuetify = new Vuetify({})

    const userModule = {
      namespaced: true,
      state: UserModule.state,
      actions: UserModule.actions,
      mutations: UserModule.mutations,
      getters: UserModule.getters
    }

    const store = new Vuex.Store({
      state: {},
      strict: false,
      modules: {
        user: userModule
      }
    })

    wrapperFactory = (propsData) => {
      return mount(PADInfoForm, {
        store,
        localVue,
        vuetify,
        propsData: {
          ...propsData
        }
      })
    }

    wrapper = wrapperFactory({ padInformation: {} })
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('should render heading correctly', () => {
    expect(wrapper.find('h4').text()).toBe('Banking Information')
  })

  it('initial input fields should be empty', () => {
    expect(wrapper.vm.$data.transitNumber).toBeFalsy()
    expect(wrapper.vm.$data.institutionNumber).toBeFalsy()
    expect(wrapper.vm.$data.accountNumber).toBeFalsy()
  })

  it('initial tos agreement should be false', () => {
    expect(wrapper.vm.$data.isTOSAccepted).toBeFalsy()
  })

  it('the isTermsAccepted function should set tos agreed', () => {
    expect(wrapper.vm.$data.isTOSAccepted).toBeFalsy()
    wrapper.vm.isTermsAccepted(true)
    expect(wrapper.vm.$data.isTOSAccepted).toBeTruthy()
  })

  it('input fields should load data correctly', async () => {
    const padInformation = {
      transitNumber: '12345',
      institutionNumber: '123',
      accountNumber: '123456789'
    }
    wrapper = wrapperFactory({
      padInformation
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$data.transitNumber).toBe(padInformation.transitNumber)
    expect(wrapper.vm.$data.institutionNumber).toBe(padInformation.institutionNumber)
    expect(wrapper.vm.$data.accountNumber).toBe(padInformation.accountNumber)
  })
})
