
export const VALIDATION_MESSAGES = {
  name: {
    isString: 'Le nom doit être une chaîne de caractères.',
    required: 'Le nom est obligatoire.',
    minLength: 'Le nom doit contenir au moins 3 caractères.',
    maxLength: 'Le nom ne doit pas dépasser 10 caractères.',
  },

  description: {
    isString: 'La description doit être une chaîne de caractères.',
    required: 'La description est obligatoire.',
    minLength: 'La description doit contenir au moins 10 caractères.',
  },

  status: {
    isEnum: 'Le statut doit être une valeur valide.',
  },
};
