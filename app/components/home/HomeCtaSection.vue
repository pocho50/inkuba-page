<script setup lang="ts">
type HomeCta = {
  title: string;
  description: string;
  buttonLabel: string;
  modal: {
    title: string;
    description: string;
  };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    projectLabel: string;
    projectPlaceholder: string;
    cancelLabel: string;
    submitLabel: string;
  };
  successToast: {
    title: string;
    description: string;
  };
  errorToast?: {
    title: string;
    description: string;
  };
};

const props = defineProps<{
  cta: HomeCta;
}>();

const cta = computed(() => props.cta);

type ContactFormState = {
  name: string;
  email: string;
  project: string;
  turnstileToken: string;
};

type ContactFormError = {
  name: keyof ContactFormState;
  message: string;
};

type ContactFormSubmitEvent = {
  data: ContactFormState;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isContactModalOpen = ref(false);
const contactForm = reactive({
  name: "",
  email: "",
  project: "",
  turnstileToken: "",
});
const isSubmitting = ref(false);

const toast = useToast();

const validate = (state: ContactFormState): ContactFormError[] => {
  const errors: ContactFormError[] = [];

  if (!state.name.trim()) {
    errors.push({ name: "name", message: "Este campo es obligatorio" });
  }

  if (!state.email.trim()) {
    errors.push({ name: "email", message: "Este campo es obligatorio" });
  } else if (!emailRegex.test(state.email)) {
    errors.push({ name: "email", message: "Email inválido" });
  }

  if (!state.project.trim()) {
    errors.push({ name: "project", message: "Este campo es obligatorio" });
  }

  if (!state.turnstileToken) {
    errors.push({
      name: "turnstileToken",
      message: "Verificación de seguridad requerida",
    });
  }

  return errors;
};

const onContactSubmit = async (event: ContactFormSubmitEvent) => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: event.data.name,
        email: event.data.email,
        project: event.data.project,
        turnstileToken: contactForm.turnstileToken,
      },
    });

    const successToast = cta.value.successToast;

    toast.add({
      title: successToast?.title || "Formulario enviado",
      description:
        successToast?.description ||
        "Te contactaremos en menos de 24 horas hábiles.",
      color: "success",
    });

    isContactModalOpen.value = false;
    contactForm.name = "";
    contactForm.email = "";
    contactForm.project = "";
    contactForm.turnstileToken = "";
  } catch {
    const errorToast = cta.value.errorToast;

    toast.add({
      title: errorToast?.title || "No pudimos enviar el formulario",
      description:
        errorToast?.description || "Intentalo nuevamente en unos minutos.",
      color: "error",
    });
    // Reset token on error too so user can retry
    contactForm.turnstileToken = "";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <UPageCTA
    id="contact"
    :title="cta.title"
    :description="cta.description"
    variant="naked"
    class="overflow-hidden @container"
  >
    <template #headline>
      <div class="@max-[1280px]:hidden">
        <UColorModeImage
          light="/images/light/line-6.svg"
          dark="/images/dark/line-6.svg"
          class="absolute left-10 -top-10 sm:top-0 h-full"
        />
        <UColorModeImage
          light="/images/light/line-7.svg"
          dark="/images/dark/line-7.svg"
          class="absolute right-0 bottom-0 h-full"
        />
      </div>
    </template>

    <template #links>
      <UButton
        :label="cta.buttonLabel"
        size="lg"
        trailing-icon="i-lucide-arrow-right"
        @click="isContactModalOpen = true"
      />
    </template>

    <LazyStarsBg />
  </UPageCTA>

  <UModal
    v-model:open="isContactModalOpen"
    :title="cta.modal?.title || cta.title"
    :description="cta.modal?.description || cta.description"
  >
    <template #body>
      <UForm
        :state="contactForm"
        :validate="validate"
        class="space-y-4"
        @submit="onContactSubmit"
      >
        <UFormField :label="cta.form?.nameLabel || ''" name="name" required>
          <UInput
            v-model="contactForm.name"
            :placeholder="cta.form?.namePlaceholder || ''"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="cta.form?.emailLabel || ''" name="email" required>
          <UInput
            v-model="contactForm.email"
            type="email"
            :placeholder="cta.form?.emailPlaceholder || ''"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="cta.form?.projectLabel || ''"
          name="project"
          required
        >
          <UTextarea
            v-model="contactForm.project"
            :placeholder="cta.form?.projectPlaceholder || ''"
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <UFormField name="turnstileToken" :error="undefined">
          <NuxtTurnstile v-model="contactForm.turnstileToken" class="mt-2" />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            :label="cta.form?.cancelLabel || ''"
            color="neutral"
            variant="ghost"
            :disabled="isSubmitting"
            @click="isContactModalOpen = false"
          />
          <UButton
            :label="cta.form?.submitLabel || ''"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
