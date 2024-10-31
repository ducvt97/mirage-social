<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit.prevent="onSubmit"
  >
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <div class="flex w-full gap-x-5">
      <UFormGroup label="First Name" name="firstName" class="flex-1">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup label="Last Name" name="lastName" class="flex-1">
        <UInput v-model="state.lastName" />
      </UFormGroup>
    </div>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">Register</UButton>
  </UForm>
  <ULink to="/login">Already have an account? Login now.</ULink>
</template>

<script setup lang="ts">
import { object, string, ObjectSchema, type InferType } from "yup";
import type { Form, FormSubmitEvent } from "#ui/types";
import type { Error, LoginResponse } from "~/common/interfaces";
import { transformErrorObject } from "~/common/utils";

interface LoginRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/* Validation */
const schema: ObjectSchema<LoginRequest> = object({
  email: string().required().email(),
  password: string().required(),
  firstName: string().required(),
  lastName: string().required(),
});

type Schema = InferType<typeof schema>;

/* Composables */
const { startProgress, endProgress } = useLoading();

/* State */
const form = ref<Form<Schema>>();
const state = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
});

/* Methods */
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    startProgress();
    const res = await useApiClient<LoginResponse>("auth/register", "post", {
      body: {
        email: event.data.email,
        password: event.data.password,
        firstName: event.data.firstName,
        lastName: event.data.lastName,
      },
    });

    if (!res?.success) {
      const errors = transformErrorObject(res?.error as Error);
      form.value?.setErrors(errors);
      return;
    }

    form.value?.clear();

    console.log(res);
  } catch (error) {
    console.error(error);
  } finally {
    endProgress();
  }
}
</script>
