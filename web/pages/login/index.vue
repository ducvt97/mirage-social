<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit.prevent="onSubmit"
  >
    <AppAlertMessage v-if="isShowError" type="error" :message="errorMessage" />
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">Login</UButton>
  </UForm>
  <ULink to="/register">Don't have an account? Register one.</ULink>
</template>

<script setup lang="ts">
import { object, string, ObjectSchema, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import type { LoginResponse } from "~/common/interfaces";

interface LoginRequest {
  email: string;
  password: string;
}

const schema: ObjectSchema<LoginRequest> = object({
  email: string().required(),
  password: string().required(),
});

type Schema = InferType<typeof schema>;

const { startProgress, endProgress } = useLoading();
const { login } = useAuth();

const state = reactive({
  email: "",
  password: "",
});
const isShowError = ref(false);
const errorMessage = ref("");

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    startProgress();
    const res = await useApiClient<LoginResponse>("auth/login", "post", {
      body: {
        email: event.data.email,
        password: event.data.password,
      },
    });

    if (!res?.success) {
      isShowError.value = true;
      errorMessage.value = res?.error || "";
      return;
    }

    if (!res.data) {
      return;
    }

    const { token, user } = res.data;
    isShowError.value = false;
    login(token, user);
    navigateTo("/");
  } catch (error) {
    console.error(error);
  } finally {
    endProgress();
  }
}
</script>
