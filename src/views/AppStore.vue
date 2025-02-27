<template>
  <div class="p-sm-2">
    <div class="mt-3 mb-4">
      <div class="">
        <h1>app store</h1>
        <p class="text-muted">
          Add super powers to your Umbrel with amazing self-hosted applications
        </p>
      </div>
    </div>
    <div class="app-store-card-columns">
      <card-widget
        v-for="categorizedApps in categorizedAppStore"
        :key="categorizedApps[0].category"
        class="pb-2 card-app-list"
        :header="categorizedApps[0].category"
      >
        <router-link
          :to="`/app-store/${app.id}`"
          v-for="app in categorizedApps"
          :key="app.id"
          class="app-list-app d-flex justify-content-between align-items-center px-3 px-lg-4 py-3"
        >
          <div class="d-flex">
            <div class="d-block">
              <img
                class="app-icon mr-2 mr-lg-3"
                :src="`https://getumbrel.github.io/umbrel-apps-gallery/${app.id}/icon.svg`"
              />
            </div>
            <div class="d-flex justify-content-center flex-column">
              <h3 class="app-name font-weight-bolder text-dark mb-1">
                {{ app.name }}
              </h3>
              <p class="text-muted mb-0">
                {{ app.tagline }}
              </p>
            </div>
          </div>
          <svg
            width="14"
            height="25"
            viewBox="0 0 14 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ml-4 icon-arrow"
          >
            <path
              d="M0.512563 3.0484C-0.170855 2.35104 -0.170855 1.22039 0.512563 0.523023C1.19598 -0.174341 2.30402 -0.174341 2.98744 0.523023L13.4874 11.2373C14.1499 11.9133 14.1731 13.0019 13.54 13.7066L3.91502 24.4209C3.26193 25.1479 2.15494 25.197 1.44248 24.5306C0.730023 23.8642 0.681893 22.7346 1.33498 22.0076L9.82776 12.5537L0.512563 3.0484Z"
              fill="#C3C6D1"
            />
          </svg>
          <!-- Preload gallery images -->
          <div class="d-none">
            <img
              v-for="image in app.gallery"
              class="d-none"
              :key="app.id + image"
              :src="`https://getumbrel.github.io/umbrel-apps-gallery/${app.id}/${image}`"
            />
          </div>
        </router-link>
      </card-widget>
      <card-widget
        class="pb-2 card-app-list umbrel-dev-note mt-2"
      >
      <div class="px-3 px-lg-4 py-3">
        <span class="rocket ml-3 ml-lg-4">🚀</span>
        <h4 class="font-weight-normal mt-4">Get your app on the Umbrel App Store</h4>
        <p class="text-muted mb-3">
          Use any programming language, database or framework to build your app for Umbrel.
        </p>
        <b-link href="https://github.com/getumbrel/umbrel/blob/master/apps/README.md" target="_blank">Learn more</b-link>
      </div>
      </card-widget>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import CardWidget from "@/components/CardWidget";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      store: (state) => state.apps.store,
    }),
    categorizedAppStore: function () {
      let group = this.store.reduce((r, a) => {
        r[a.category] = [...(r[a.category] || []), a];
        return r;
      }, {});
      return group;
    },
  },
  created() {
    this.$store.dispatch("apps/getAppStore");
  },
  components: {
    CardWidget,
  },
};
</script>

<style lang="scss" scoped>
.app-list-app {
  border-bottom: solid 1px #edf0f7;
  &:first-child {
    padding-top: 0 !important;
  }
  &:last-child {
    border-bottom: none;
  }
  .icon-arrow {
    will-change: tranform;
    transform: translate3d(0, 0, 0);
    transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  &:hover {
    .icon-arrow {
      transform: translate3d(6px, 0, 0);
    }
  }
}

.umbrel-dev-note {
  position: relative;
  overflow: visible;
  .rocket {
    font-size: 60px;
    position: absolute;
    top: -30px;
    left: 0;
  }
}
</style>
