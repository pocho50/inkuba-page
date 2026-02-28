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

const isContactModalOpen = ref(false);
const contactForm = reactive({
  name: "",
  email: "",
  project: "",
});
const isSubmitting = ref(false);

const toast = useToast();

const onContactSubmit = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: contactForm.name,
        email: contactForm.email,
        project: contactForm.project,
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
      <form class="space-y-4" @submit.prevent="onContactSubmit">
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
      </form>
    </template>
  </UModal>
</template>
