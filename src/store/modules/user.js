import API from "@/helpers/api";
import router from "@/router";

// Initial state
const state = () => ({
  name: "",
  jwt: window.localStorage.getItem("jwt") || "",
  registered: true,
  seed: [],
  installedApps: [],
  otpEnabled: false
});

// Functions to update the state directly
const mutations = {
  setJWT(state, jwt) {
    window.localStorage.setItem("jwt", jwt);
    state.jwt = jwt;
  },
  setRegistered(state, registered) {
    state.registered = registered;
  },
  setName(state, name) {
    state.name = name;
  },
  setInstalledApps(state, installedApps) {
    state.installedApps = installedApps;
  },
  setSeed(state, seed) {
    state.seed = seed;
  },
  setOtpEnabled(state, otpEnabled) {
    state.otpEnabled = otpEnabled;
  }
};

// Functions to get data from the API
const actions = {
  async login({ commit }, { password, otpToken }) {
    const {
      data
    } = await API.post(
      `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/login`,
      { password, otpToken }
    );

    if (data && data.jwt) {
      commit("setJWT", data.jwt);
    }
  },

  logout({ commit, state }) {
    if (state.jwt) {
      commit("setJWT", "");
      router.push("/");
    }
  },

  async refreshJWT({ commit }) {
    const { data } = await API.post(
      `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/refresh`
    );
    if (data && data.jwt) {
      commit("setJWT", data.jwt);
    }
  },

  async registered({ commit }) {
    const { registered } = await API.get(
      `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/registered`
    );
    commit("setRegistered", !!registered);
  },

  async getInfo({ commit }) {
    const { name, otpEnabled, installedApps } = await API.get(
      `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/info`
    );
    commit("setName", name);
    commit("setOtpEnabled", otpEnabled);
    commit("setInstalledApps", installedApps);
  },

  async getSeed({ commit, state, dispatch }, { password, otpToken }) {
    let rawSeed;

    //first check if user is registered or not
    await dispatch("registered");

    //get user's stored seed if already registered
    if (state.registered && password) {
      rawSeed = await API.post(
        `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/seed`,
        {
          password,
          otpToken
        },
        false
      );
      if (rawSeed.data) {
        rawSeed = rawSeed.data;
      }
    } else {
      //get a new seed if new user
      rawSeed = await API.get(
        `${process.env.VUE_APP_MIDDLEWARE_API_URL}/v1/lnd/wallet/seed`
      );
    }

    if (rawSeed && rawSeed.seed) {
      commit("setSeed", rawSeed.seed);
    }
  },

  async register({ commit, state }, { name, password, seed }) {
    if (!state.registered) {
      const result = await API.post(
        `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/register`,
        {
          name,
          password,
          seed
        },
        false
      );

      if (result.data && result.data.jwt) {
        commit("setJWT", result.data.jwt);
        commit("setRegistered", true);
        commit("setSeed", []); //remove seed from store
      }
    }
  },
  async enableOtpAuth({ commit }, { otpToken, otpUri }) {
    await API.post(
      `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/otp/enable`,
      {
        otpToken,
        otpUri
      },
      false
    );
    return commit("setOtpEnabled", true);
  },
  async disableOtpAuth({ commit }, { otpToken }) {
    await API.post(
      `${process.env.VUE_APP_MANAGER_API_URL}/v1/account/otp/disable`,
      {
        otpToken
      },
      false
    );
    return commit("setOtpEnabled", false);
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
