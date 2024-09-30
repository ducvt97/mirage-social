<template>
    <div class="flex flex-col w-full h-full">
        <AppHeader />
        <div class="flex-1">
            <UContainer>
                <slot />
            </UContainer>
        </div>
        <AppFooter />
    </div>
</template>
