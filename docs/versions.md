---
outline: deep
---

<script setup>
import { ref, computed } from "vue";

const packageInfo = ref();
const versions = computed(() => 
  Array.from(Object.values(packageInfo.value?.versions ?? {}))
);
const versionsExtended = computed(() => versions.value.map(version => {
  const [major, minor, patch] = version.version.split(/\./).slice(0, 3).map(Number);
  return {
    ...version,
    detailedVersion: {
      major,
      minor,
      patch,
    },
  };
}));
const sortedVersions = computed(() => versionsExtended.value.toSorted((aVer,bVer) => {
  if (aVer.version === bVer.version) {
    return 0;
  }
  const a = aVer.detailedVersion;
  const b = bVer.detailedVersion;
  if (a.major === b.major) {
    if (a.minor === b.minor) {
      return a.patch > b.patch ? -1 : 1;
    }
    return a.minor > b.minor ? -1 : 1;
  }
  return a.major > b.major ? -1 : 1;
}));

void (async () => {
  packageInfo.value = await fetch("https://registry.npmjs.org/u-spy")
    .then(r => r.json());
})();
</script>

# versions

<ul class="version-list">
  <li class="version-list-item" v-for="({ version }, index) of sortedVersions" :key="index">
    <a :href="`https://github.com/tomsdoo/u-spy/releases/tag/v${version}`" target="_blank">{{ version }}</a>
  </li>
</ul>

<style>
.version-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  list-style: none;
  > li.version-list-item {
    display: grid;
    margin-top: 0;
    > a {
      display: grid;
      width: 100%;
      height: 100%;
      box-shadow: inset 0 0 1px;
      padding: 1em;
      justify-content: center;
      align-items: center;
    }
  }
}

.vp-doc .version-list {
  padding-left: 0;
}
</style>
