import { yupResolver } from '@hookform/resolvers/yup';
import { type ReactNode } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { ALLOWED_FILE_TYPES } from '@/common/constants';
import { RoutePath } from '@/common/enums';
import { type SchemaInferredType, validationSchema } from '@/common/validationSchema';
import { CustomButton } from '@/components/custom-button/CustomButton';
import { FormInputField } from '@/components/form-input-field/FormInputField';
import { FormPasswordField } from '@/components/form-password-field/FormPasswordField';
import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import styles from '@/pages/uncontrolled-form/UncontrolledForm.module.scss';
import { saveFormData } from '@/store/slices/form-data-slice';
import { fileToBase64 } from '@/utils/utils';

export function ReactHookForm(): ReactNode {
  const {
    formState: { errors, isDirty, isSubmitting, isValid },
    handleSubmit,
    register,
  } = useForm<SchemaInferredType>({
    defaultValues: {
      gender: 'male',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const countries = useAppSelector((state) => state.countries);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onValid: SubmitHandler<SchemaInferredType> = (data) => {
    fileToBase64(data.picture)
      .then((base64String) => {
        const submitData = { ...data, picture: base64String };

        dispatch(saveFormData(submitData));
        navigate(RoutePath.MAIN, { state: true });
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>React hook form</h1>
        <nav className={styles.nav}>
          <Link className={styles.link} to={RoutePath.MAIN}>
            Back to Main Page
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <form className={styles.form} name="react-hook-form" noValidate onSubmit={(e) => void handleSubmit(onValid)(e)}>
          <FormInputField label="Name" inputProps={{ ...register('name') }} error={errors.name?.message} />
          <FormInputField label="Age" inputProps={{ ...register('age'), type: 'number' }} error={errors.age?.message} />
          <FormInputField
            label="E-mail"
            inputProps={{ ...register('email'), type: 'email' }}
            error={errors.email?.message}
          />

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Password</legend>
            <FormPasswordField
              label="Enter password"
              inputProps={{ ...register('password') }}
              error={errors.password?.message}
            />

            <FormInputField
              label="Confirm password"
              inputProps={{ ...register('password-confirm'), type: 'password' }}
              error={errors['password-confirm']?.message}
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Gender</legend>
            <div className={styles.radioContainer}>
              <FormInputField
                label="Male"
                inputProps={{ ...register('gender'), type: 'radio', value: 'male' }}
                hasFieldWrapper={false}
                isErrorShown={false}
                isRowLayout
              />
              <FormInputField
                label="Female"
                inputProps={{ ...register('gender'), type: 'radio', value: 'female' }}
                hasFieldWrapper={false}
                isErrorShown={false}
                isRowLayout
              />
              <FormInputField
                label="Other"
                inputProps={{ ...register('gender'), type: 'radio', value: 'other' }}
                hasFieldWrapper={false}
                isErrorShown={false}
                isRowLayout
              />
            </div>
          </fieldset>

          <FormInputField
            label="Choose a picture"
            inputProps={{ ...register('picture'), type: 'file', accept: ALLOWED_FILE_TYPES.join(',') }}
            error={errors.picture?.message}
          />

          <datalist id="countries">
            {countries.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>

          <FormInputField
            label="Country"
            inputProps={{ list: 'countries', ...register('country') }}
            error={errors.country?.message}
          />

          <FormInputField
            label="By signing up you agree to our Terms and Conditions"
            inputProps={{ ...register('tac'), type: 'checkbox' }}
            error={errors.tac?.message}
            isRowLayout
          />

          <CustomButton className={styles.submitButton} type="submit" disabled={isSubmitting || !isDirty || !isValid}>
            Submit
          </CustomButton>
        </form>
      </main>
    </div>
  );
}
