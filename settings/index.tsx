function settingsComponent(props: SettingsComponentProps): JSX.Element {
  return (
    <Page>
      <Section title={<Text bold align="center"> Conversions </Text>}>
        <TextInput
          title='Convert From'
          label='Convert From'
          settingsKey='convertfrom'
          action='save'
        />
        <TextInput
          title='Convert To'
          label='Convert To'
          settingsKey='convertto'
          action='save'
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);