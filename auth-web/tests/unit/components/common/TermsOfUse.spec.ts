import { Wrapper, createLocalVue, mount } from '@vue/test-utils'
import TermsOfUse from '@/components/auth/common/TermsOfUse.vue'
import UserModule from '@/store/modules/user'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import appStore from '@/store'
import axios from 'axios'
import sinon from 'sinon'

Vue.config.silent = true

Vue.use(Vuetify)
Vue.use(VueRouter)

jest.mock('@/services/document.services')

describe('TermsOfUse.vue', () => {
  let wrapper: any
  let wrapperFactory: any
  let sinonAxiosGet

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

    sinonAxiosGet = sinon.stub(axios, 'get')

    sinonAxiosGet
      .withArgs('/documents/termsofuse')
      .returns(new Promise(resolve => {
        return resolve({
          data: {
            versionId: '3',
            content: 'terms of service content',
            type: 'termsofuse'
          }
        })
      }
      ))

    const vuetify = new Vuetify({})

    const userModule = {
      namespaced: true,
      state: {
        userProfile: {
          userTerms: {
            termsOfUseAcceptedVersion: '3'
          }
        },
        ...UserModule.state
      },
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
      return mount(TermsOfUse, {
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
    sinon.restore()
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('is has container for terms', () => {
    expect(wrapper.find('.terms-container')).toBeTruthy()
  })

  it('is intital content to be empty', () => {
    expect(wrapper.vm.$data.termsContent).toBeFalsy()
  })

  it('check whether user accepted updated tos', () => {
    // eslint-disable-next-line no-console
    console.log(wrapper.vm.userProfile)
    const latestTosVersion = '3'
    expect(wrapper.vm.hasAcceptedLatestTos(latestTosVersion)).toBeTruthy()
  })
})
