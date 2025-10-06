<template>
    <div class="main-wrapper">
        <main class="main">
            <section class="home container">
                <div class="home__item">
                    <h2 class="h2">Buttons</h2>
                    <div class="home__components">
                        <UIButton> Button </UIButton>
                        <UIButton size="l"> Another size </UIButton>
                        <UIButton color="gray"> Another color </UIButton>
                        <UIButton clear> Transparent </UIButton>
                        <UIButton is-loading> With icon </UIButton>
                        <UIButton disabled> Disabled </UIButton>
                    </div>
                </div>
                <div class="home__item">
                    <h2 class="h2">Buttons group</h2>
                    <div class="home__components">
                        <div class="button-group">
                            <UIButton> Button </UIButton>
                            <UIButton size="l"> Another size </UIButton>
                        </div>
                    </div>
                </div>
                <div class="home__item">
                    <h2 class="h2">Popup</h2>
                    <div class="home__components">
                        <div class="button-group">
                            <UIButton @click="showPopup = true"> Button </UIButton>
                            <UIPopup
                                v-if="showPopup"
                                v-model="showPopup"
                                ref="popupRef"
                                :bottom="isMobileOrTablet"
                                class-name="demo-popup"
                            >
                                <template #header>
                                    <h3 class="h3">Popup</h3>
                                </template>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                egestas, urna non tincidunt ultrices, lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Sed egestas, urna non tincidunt
                                ultrices, lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sed egestas, urna non tincidunt ultrices, lorem ipsum dolor sit
                                amet, consectetur adipiscing elit. Sed egestas, urna non tincidunt
                                ultrices, lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                <template #footer>
                                    <UIButton @click="popupRef?.close"> Close </UIButton>
                                </template>
                            </UIPopup>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <div id="teleports"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import checkDevice from "@/utils/checkDevice";

import UIButton from "@/components/UIButton.vue";
import UIPopup from "@/components/UIPopup.vue";

const { isMobileOrTablet } = checkDevice();

const popupRef = ref<InstanceType<typeof UIPopup> | null>(null);
const showPopup = ref<boolean>(false);
</script>
