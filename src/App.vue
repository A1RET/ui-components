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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas,
                            urna non tincidunt ultrices, lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. Sed egestas, urna non tincidunt ultrices, lorem ipsum
                            dolor sit amet, consectetur adipiscing elit. Sed egestas, urna non
                            tincidunt ultrices, lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed egestas, urna non tincidunt ultrices, lorem ipsum dolor sit
                            amet, consectetur adipiscing elit.
                            <template #footer>
                                <UIButton @click="popupRef?.close"> Close </UIButton>
                            </template>
                        </UIPopup>
                    </div>
                </div>
                <div class="home__item">
                    <h2 class="h2">Checkboxes</h2>
                    <span>Options: {{ options }}</span>
                    <div class="home__components">
                        <UICheckboxesGroup
                            v-model="checkboxesValue"
                            :options="options"
                            :is-column="true"
                            control-class-name="demo-checkbox"
                        />
                    </div>
                    <span>Selected values: {{ checkboxesValue }}</span>
                </div>
                <div class="home__item">
                    <h2 class="h2">Checkboxes as chips</h2>
                    <span>Options: {{ options }}</span>
                    <div class="home__components">
                        <UICheckboxesGroup
                            v-model="checkboxesValue"
                            :options="options"
                            :is-column="true"
                            is-chip
                            control-class-name="demo-checkbox"
                        />
                    </div>
                    <span>Selected values: {{ checkboxesValue }}</span>
                </div>
                <div class="home__item">
                    <h2 class="h2">Radio</h2>
                    <span>Options: {{ options }}</span>
                    <div class="home__components">
                        <UIRadioGroup
                            v-model="radioValue"
                            :options="options"
                            :is-column="true"
                            control-class-name="demo-checkbox"
                        />
                    </div>
                    <span>Selected values: {{ radioValue }}</span>
                </div>
                <div class="home__item">
                    <h2 class="h2">Select</h2>
                    <span>Options: {{ options }}</span>
                    <div class="home__components">
                        <UISelect
                            v-model="selectValue"
                            :options="options"
                            multiple
                            control-class-name="demo-checkbox"
                        />
                    </div>
                    <span>Selected values: {{ selectValue }}</span>
                </div>
                <div class="home__item">
                    <h2 class="h2">Accordion</h2>
                    <div class="home__components">
                        <UIAccordion :items="accordionItems">
                            <template #content="{ content }">
                                <ul
                                    v-if="Array.isArray(content)"
                                    class="selections-lists__list"
                                    style="margin: 0"
                                >
                                    <li
                                        v-for="item in content as Array<AccordionContentItem>"
                                        :key="item.value"
                                        class="selections-lists__list-item"
                                    >
                                        {{ item.value }}
                                    </li>
                                </ul>
                            </template>
                        </UIAccordion>
                    </div>
                </div>
                <div class="home__item">
                    <h2 class="h2">Dropdown</h2>
                    <div class="home__components">
                        <UIDropdown>
                            Click to open dropdown
                            <template #content> Dropdown Content </template>
                        </UIDropdown>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <div id="teleports"></div>
</template>

<script setup lang="ts">
type AccordionContentItem = {
    value: string;
};

import { ref } from "vue";

import checkDevice from "@/utils/checkDevice";

import UIButton from "@/components/UIButton.vue";
import UIPopup from "@/components/UIPopup.vue";
import UICheckboxesGroup from "@/components/UICheckboxesGroup.vue";
import UIRadioGroup from "@/components/UIRadioGroup.vue";
import UISelect from "@/components/UISelect.vue";
import UIAccordion from "@/components/UIAccordion.vue";
import UIDropdown from "@/components/UIDropdown.vue";

const { isMobileOrTablet } = checkDevice();

const popupRef = ref<InstanceType<typeof UIPopup> | null>(null);
const showPopup = ref<boolean>(false);

const options: Array<{ [key: string]: string }> = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
];

const checkboxesValue = ref<Array<string | number | object>>([]);
const radioValue = ref<string | number | { [key: string]: string }>(options[1]!);
const selectValue = ref<Array<string | number | object>>([]);

const accordionItems = ref<Array<{ title: string; content: Array<AccordionContentItem> }>>([
    { title: "Title 1", content: [{ value: "Content 1.1" }, { value: "Content 1.2" }] },
    { title: "Title 2", content: [{ value: "Content 2.1" }] },
    {
        title: "Title 3",
        content: [{ value: "Content 3.1" }, { value: "Content 3.2" }, { value: "Content 3.2" }],
    },
]);
</script>
