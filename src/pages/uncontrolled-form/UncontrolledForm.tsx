import { type FormEvent, type ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';

import { ALLOWED_FILE_TYPES } from '@/common/constants';
import { RoutePath } from '@/common/enums';
import { validationSchema } from '@/common/validationSchema';
import { CustomButton } from '@/components/custom-button/CustomButton';
import { FormInputField } from '@/components/form-input-field/FormInputField';
import { FormPasswordField } from '@/components/form-password-field/FormPasswordField';
import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import { saveFormData } from '@/store/slices/form-data-slice';
import { fileToBase64 } from '@/utils/utils';

import styles from './UncontrolledForm.module.scss';

type FormErrors = Record<string, string>;

export function UncontrolledForm(): ReactNode {
  const [errors, setErrors] = useState<FormErrors>({});
  const countries = useAppSelector((state) => state.countries);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const formEntries: Record<string, unknown> = Object.fromEntries(formData.entries());

    formEntries.tac = formData.get('tac') === 'on';

    try {
      const result = validationSchema.validateSync(formEntries, { abortEarly: false });

      fileToBase64(result.picture)
        .then((base64String) => {
          const submitData = { ...result, picture: base64String };

          dispatch(saveFormData(submitData));
          navigate(RoutePath.MAIN, { state: true });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      if (error instanceof ValidationError) {
        const formErrors: FormErrors = {};

        error.inner.forEach((err) => {
          if (err.path && !formErrors[err.path]) {
            formErrors[err.path] = err.message;
          }
        });

        setErrors(formErrors);
      } else {
        throw error;
      }
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Uncontrolled form</h1>
        <nav className={styles.nav}>
          <Link className={styles.link} to={RoutePath.MAIN}>
            Back to Main Page
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <form className={styles.form} name="uncontrolled-form" noValidate onSubmit={handleSubmit}>
          <FormInputField label="Name" inputProps={{ name: 'name' }} error={errors.name} />
          <FormInputField label="Age" inputProps={{ name: 'age', type: 'number' }} error={errors.age} />
          <FormInputField label="E-mail" inputProps={{ name: 'email', type: 'email' }} error={errors.email} />

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Password</legend>
            <FormPasswordField label="Enter password" inputProps={{ name: 'password' }} error={errors.password} />

            <FormInputField
              label="Confirm password"
              inputProps={{ name: 'password-confirm', type: 'password' }}
              error={errors['password-confirm']}
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Gender</legend>
            <div className={styles.radioContainer}>
              <FormInputField
                label="Male"
                inputProps={{ name: 'gender', type: 'radio', value: 'male', defaultChecked: true }}
                hasFieldWrapper={false}
                isErrorShown={false}
                isRowLayout
              />
              <FormInputField
                label="Female"
                inputProps={{ name: 'gender', type: 'radio', value: 'female' }}
                hasFieldWrapper={false}
                isErrorShown={false}
                isRowLayout
              />
              <FormInputField
                label="Other"
                inputProps={{ name: 'gender', type: 'radio', value: 'other' }}
                hasFieldWrapper={false}
                isErrorShown={false}
                isRowLayout
              />
            </div>
          </fieldset>

          <FormInputField
            label="Choose a picture"
            inputProps={{ name: 'picture', type: 'file', accept: ALLOWED_FILE_TYPES.join(',') }}
            error={errors.picture}
          />

          <datalist id="countries">
            {countries.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>

          <FormInputField label="Country" inputProps={{ list: 'countries', name: 'country' }} error={errors.country} />

          <FormInputField
            label="By signing up you agree to our Terms and Conditions"
            inputProps={{ name: 'tac', type: 'checkbox' }}
            error={errors.tac}
            isRowLayout
          />

          <CustomButton className={styles.submitButton} type="submit">
            Submit
          </CustomButton>
        </form>
      </main>
    </div>
  );
}
