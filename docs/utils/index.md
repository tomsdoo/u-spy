---
outline: deep
---

<script setup>
import { ref, computed, onMounted } from "vue";
import { useData, useRouter } from 'vitepress';

const { site, theme } = useData();
const siteBase = computed(() => site.value?.base);
const sidebar = computed(() => theme.value?.sidebar);
const itemsInContents = computed(() => sidebar.value?.find(({ text }) => text === "contents")?.items);
const itemsInUtils = computed(() => itemsInContents.value?.find(({ text }) => text === "utils")?.items);
const router = useRouter();

function onClickLink(link) {
  if (siteBase.value == null) {
    router.go(link);
    return;
  }
  const nextLink = `${siteBase.value}${link}`.replace(/\/\//g, "/");
  router.go(nextLink);
}
</script>

# utils

<ul class="link-list">
  <li v-for="{ text, link } of itemsInUtils" :key="link">
    <a :to="link" @click="onClickLink(link)">{{ text }}</a>
  </li>
</ul>

<style scoped>
.link-list {
  a {
    cursor: pointer;
  }
}
</style>
