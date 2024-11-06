<template>
  <div v-if="registerSuccess">
    You have successfully registered an account.<br />
    Please wait for {{ countdown }} second(s) to redirect to
    <ULink to="/login">Login page</ULink>.
  </div>
  <div v-else>
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
  </div>
</template>

<script setup lang="ts">
import { object, string, ObjectSchema, type InferType } from "yup";
import type { Form, FormSubmitEvent } from "#ui/types";
import type { RegisterResponse } from "~/common/interfaces";
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
const registerSuccess = ref(false);
const countdown = ref(5);
let countdownInterval: string | number | NodeJS.Timeout | undefined;

onBeforeRouteLeave(() => {
  clearInterval(countdownInterval);
});

watch(countdown, (value) => {
  if (value <= 0) {
    navigateTo("/login");
  }
});

/* Methods */
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    startProgress();
    const res = await useApiClient<RegisterResponse>("auth/register", "post", {
      body: {
        email: event.data.email,
        password: event.data.password,
        firstName: event.data.firstName,
        lastName: event.data.lastName,
      },
    });

    if (!res?.success) {
      const errors = transformErrorObject(res?.error);
      form.value?.setErrors(errors);
      return;
    }

    registerSuccess.value = true;
    form.value?.clear();
    countdownInterval = setInterval(() => (countdown.value -= 1), 1000);

    console.log(res);
  } catch (error) {
    console.error(error);
  } finally {
    endProgress();
  }
}
</script>
