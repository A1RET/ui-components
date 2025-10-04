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
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import UIButton from '@/components/UIButton.vue'
</script>
