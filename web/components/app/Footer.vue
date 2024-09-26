<template>
    <div class="flex justify-between items-center px-6 py-5">
        <div>
            &#9400;{{ currentYear }}. All Rights Reserved. Powered By Duc Chu Minh.
        </div>
        <div></div>
        <div class="flex gap-x-3">
            <ULink to="https://www.linkedin.com/in/minhducchu97/" target="_blank">
                <AppIcon :name="Icons.linkedIn" />
            </ULink>
            <ULink to="https://www.facebook.com/minhduc.chu.97/" target="_blank">
                <AppIcon :name="Icons.facebook" />
            </ULink>
            <ULink to="https://github.com/ducvt97/" target="_blank">
                <AppIcon :name="Icons.github" />
            </ULink>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icons from "~/common/constants/icons";

const currentYear = new Date().getFullYear();
</script>
