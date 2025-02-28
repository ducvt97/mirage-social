<template>
  <div class="flex justify-between items-center px-6 py-3">
    <ULink to="/" class="h-12">
      <AppIcon :name="Icons.logo" size="2xl" />
    </ULink>
    <div v-if="token" class="flex gap-x-3">
      <AppMessage />
      <AppNotification />
      <UDropdown
        :items="actionItems"
        :ui="{
          item: {
            padding: 'px-3 py-2.5',
            base: 'gap-3',
            label: 'font-semibold',
            avatar: { size: 'sm' },
            icon: { base: 'w-6 h-6' },
          },
        }"
      >
        <UAvatar :src="user.avatar" size="md" />
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from "#ui/types";
import Icons from "~/common/constants/icons";

const authStore = useAuth();
const { token, user } = storeToRefs(authStore);
const { logout } = authStore;

const actionItems: DropdownItem[][] = [
  [
    {
      label: `${user.value.firstName} ${user.value.lastName}`,
      avatar: { src: user.value.avatar },
      to: `/${user.value._id}`,
    },
  ],
  [
    {
      label: "Log out",
      icon: Icons.logout,
      click: () => onclickLogout(),
    },
  ],
];

const onclickLogout = () => {
  logout();
  navigateTo("/login");
};
</script>
