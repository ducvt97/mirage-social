<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit.prevent="onSubmit"
  >
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">Login</UButton>
  </UForm>
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

const { login } = useAuth();

const state = reactive({
  email: "",
  password: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  try {
    const res = await useApiClient<LoginResponse>("auth/login", "post", {
      body: {
        userName: event.data.email,
        password: event.data.password,
      },
    });

    console.log(res);
  } catch (error) {
    console.error(error);
  }
}
</script>
