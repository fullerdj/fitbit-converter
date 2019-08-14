function settingsComponent(props: any) {
  return (
    <Page>
      <Section title={<Text bold align="center"> 1 USD = ? </Text>}>
        <TextInput
          title='Static rate'
          label='Converstion factor'
          settingsKey='staticfactor'
          action='save factor'
        />
        <TextInput
          title='Dynamic rate'
          label='Currency code'
          settingsKey='currencycode'
          action='save code'
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);