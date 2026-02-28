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
  // Anti-spam: honeypot field (hidden, bots will fill it)
  website: string;
  // Anti-spam: math challenge answer
  mathAnswer: string;
  // Anti-spam: timestamp when form opened
  formTimestamp: number;
};

type ContactFormError = {
  name: keyof ContactFormState;
  message: string;
};

type ContactFormSubmitEvent = {
  data: ContactFormState;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate simple math challenge (1-10 + 1-10)
const num1 = ref(Math.floor(Math.random() * 10) + 1);
const num2 = ref(Math.floor(Math.random() * 10) + 1);
const mathQuestion = computed(() => `${num1.value} + ${num2.value}`);
const expectedAnswer = computed(() => num1.value + num2.value);

const isContactModalOpen = ref(false);
const contactForm = reactive({
  name: "",
  email: "",
  project: "",
  website: "", // honeypot - should remain empty
  mathAnswer: "",
  formTimestamp: 0,
});
const isSubmitting = ref(false);

const toast = useToast();

// Reset math challenge when modal opens
watch(isContactModalOpen, (isOpen) => {
  if (isOpen) {
    num1.value = Math.floor(Math.random() * 10) + 1;
    num2.value = Math.floor(Math.random() * 10) + 1;
    contactForm.formTimestamp = Date.now();
    contactForm.website = "";
    contactForm.mathAnswer = "";
  }
});

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

  if (!state.mathAnswer) {
    errors.push({ name: "mathAnswer", message: "Responde la verificación" });
  } else if (Number(state.mathAnswer) !== expectedAnswer.value) {
    errors.push({ name: "mathAnswer", message: "Respuesta incorrecta" });
  }

  return errors;
};

const onContactSubmit = async (event: ContactFormSubmitEvent) => {
  if (isSubmitting.value) {
    return;
  }

  // Anti-spam checks (server will also validate)
  const fillTime = Date.now() - event.data.formTimestamp;
  if (fillTime < 3000) {
    // Less than 3 seconds = likely bot
    toast.add({
      title: "Error",
      description: "Por favor, toma tu tiempo para completar el formulario.",
      color: "error",
    });
    return;
  }

  if (event.data.website) {
    // Honeypot triggered - silently fail to not tip off bots
    toast.add({
      title: "Error",
      description: "No pudimos enviar el formulario. Intenta nuevamente.",
      color: "error",
    });
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
        website: event.data.website,
        mathAnswer: parseInt(event.data.mathAnswer),
        expectedAnswer: expectedAnswer.value,
        formTimestamp: event.data.formTimestamp,
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
    contactForm.website = "";
    contactForm.mathAnswer = "";
    contactForm.formTimestamp = 0;
  } catch {
    const errorToast = cta.value.errorToast;

    toast.add({
      title: errorToast?.title || "No pudimos enviar el formulario",
      description:
        errorToast?.description || "Intentalo nuevamente en unos minutos.",
      color: "error",
    });
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
        <!-- Honeypot: hidden field for bots -->
        <div class="hidden" aria-hidden="true">
          <UInput
            v-model="contactForm.website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

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

        <!-- Math challenge anti-spam -->
        <UFormField
          :label="`Verificación: ¿Cuánto es ${mathQuestion}?`"
          name="mathAnswer"
          required
        >
          <UInput
            v-model="contactForm.mathAnswer"
            type="number"
            placeholder="Escribe el resultado"
            class="w-full"
          />
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
