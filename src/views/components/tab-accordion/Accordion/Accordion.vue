<template>
  <Accordion :items="items" parentClass="space-y-5" />
</template>

<script>
import Accordion from '@/components/Accordion';
export default {
  components: { Accordion },
  data() {
    return {
      items: [
        {
          title: 'How does MIFP work?',
          content:
            "Jornalists call this critical, introductory section the  and when bridge properly executed, it's the that carries your reader from anheadine try at attention-grabbing to the body of your blog post.",
        },
        {
          title: 'Where i can learn more about using MIFP?',
          content:
            "Jornalists call this critical, introductory section the  and when bridge properly executed, it's the that carries your reader from anheadine try at attention-grabbing to the body of your blog post.",
        },
        {
          title: 'Why MIFP is so important?',
          content:
            "Jornalists call this critical, introductory section the  and when bridge properly executed, it's the that carries your reader from anheadine try at attention-grabbing to the body of your blog post.",
        },
      ],
    };
  },
};
</script>
