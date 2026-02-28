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
};

type HomeCtaInput = Partial<HomeCta> & {
  links?: Array<{
    label?: string;
  }>;
};

const props = defineProps<{
  cta: HomeCtaInput;
}>();

const normalizedCta = computed<HomeCta>(() => ({
  title: props.cta?.title ?? "",
  description: props.cta?.description ?? "",
  buttonLabel: props.cta?.buttonLabel ?? props.cta?.links?.[0]?.label ?? "",
  modal: {
    title: props.cta?.modal?.title ?? "",
    description: props.cta?.modal?.description ?? "",
  },
  form: {
    nameLabel: props.cta?.form?.nameLabel ?? "",
    namePlaceholder: props.cta?.form?.namePlaceholder ?? "",
    emailLabel: props.cta?.form?.emailLabel ?? "",
    emailPlaceholder: props.cta?.form?.emailPlaceholder ?? "",
    projectLabel: props.cta?.form?.projectLabel ?? "",
    projectPlaceholder: props.cta?.form?.projectPlaceholder ?? "",
    cancelLabel: props.cta?.form?.cancelLabel ?? "",
    submitLabel: props.cta?.form?.submitLabel ?? "",
  },
  successToast: {
    title: props.cta?.successToast?.title ?? "",
    description: props.cta?.successToast?.description ?? "",
  },
}));

const isContactModalOpen = ref(false);
const contactForm = reactive({
  name: "",
  email: "",
  project: "",
});

const toast = useToast();

const onContactSubmit = () => {
  toast.add({
    title: normalizedCta.value.successToast.title,
    description: normalizedCta.value.successToast.description,
    color: "success",
  });

  isContactModalOpen.value = false;
  contactForm.name = "";
  contactForm.email = "";
  contactForm.project = "";
};
</script>

<template>
  <UPageCTA
    :title="normalizedCta.title"
    :description="normalizedCta.description"
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
        :label="normalizedCta.buttonLabel"
        size="lg"
        trailing-icon="i-lucide-arrow-right"
        @click="isContactModalOpen = true"
      />
    </template>

    <LazyStarsBg />
  </UPageCTA>

  <UModal
    v-model:open="isContactModalOpen"
    :title="normalizedCta.modal.title"
    :description="normalizedCta.modal.description"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="onContactSubmit">
        <UFormField :label="normalizedCta.form.nameLabel" name="name" required>
          <UInput
            v-model="contactForm.name"
            :placeholder="normalizedCta.form.namePlaceholder"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="normalizedCta.form.emailLabel"
          name="email"
          required
        >
          <UInput
            v-model="contactForm.email"
            type="email"
            :placeholder="normalizedCta.form.emailPlaceholder"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="normalizedCta.form.projectLabel"
          name="project"
          required
        >
          <UTextarea
            v-model="contactForm.project"
            :placeholder="normalizedCta.form.projectPlaceholder"
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            :label="normalizedCta.form.cancelLabel"
            color="neutral"
            variant="ghost"
            @click="isContactModalOpen = false"
          />
          <UButton :label="normalizedCta.form.submitLabel" type="submit" />
        </div>
      </form>
    </template>
  </UModal>
</template>
