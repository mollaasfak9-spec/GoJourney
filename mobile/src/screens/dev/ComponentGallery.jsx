import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Bike,
  Car,
  Clock,
  KeyRound,
  Mail,
  Navigation,
  Phone,
  Star,
  Wallet,
} from 'lucide-react-native';

import { Screen } from '../../components/layout/Screen';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Divider } from '../../components/ui/Divider';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { IconButton } from '../../components/ui/IconButton';
import { Input } from '../../components/ui/Input';
import { ListItem } from '../../components/ui/ListItem';
import { Loader } from '../../components/ui/Loader';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Sheet } from '../../components/ui/Sheet';
import { Skeleton } from '../../components/ui/Skeleton';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useToast } from '../../components/ui/Toast';

/** Hidden dev-only screen (MOBILE_PLAN Phase 2): renders the whole UI kit in the active theme. */
export function ComponentGallery() {
  const { colors, fonts, typography } = useTheme();
  const { showToast } = useToast();

  const [inputValue, setInputValue] = useState('RideX user');
  const [vehicle, setVehicle] = useState('bike');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const vehicles = [
    { label: 'Bike', value: 'bike', icon: Bike },
    { label: 'Auto', value: 'auto', icon: Car },
    { label: 'Sedan', value: 'sedan', icon: Car },
  ];

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[typography.h3, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );

  const Row = ({ children }) => <View style={styles.row}>{children}</View>;

  return (
    <Screen scroll testID="component-gallery">
      <Header title="UI Kit" />
      <View style={styles.intro}>
        <Text
          style={[{ color: colors.textSecondary, fontFamily: fonts.regular }, typography.small]}
        >
          Dev-only component gallery. Pick a theme below — the choice persists.
        </Text>
        <ThemeToggle />
      </View>

      <Section title="Typography">
        <Text style={[typography.display, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
          Display 36
        </Text>
        <Text style={[typography.h1, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
          Heading 1 · 28
        </Text>
        <Text style={[typography.h2, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
          Heading 2 · 22
        </Text>
        <Text style={[typography.h3, { color: colors.textPrimary, fontFamily: fonts.semibold }]}>
          Heading 3 · 18
        </Text>
        <Text style={[typography.body, { color: colors.textPrimary, fontFamily: fonts.regular }]}>
          Body 16 — the standard paragraph size.
        </Text>
        <Text
          style={[typography.small, { color: colors.textSecondary, fontFamily: fonts.regular }]}
        >
          Small 14 — secondary sentences.
        </Text>
        <Text
          style={[typography.caption, { color: colors.textTertiary, fontFamily: fonts.medium }]}
        >
          Caption 12 · labels · timestamps
        </Text>
        <Text style={[typography.statXL, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
          ₹ 2,840
        </Text>
      </Section>

      <Section title="Buttons">
        <Button
          label="Primary"
          onPress={() => showToast({ message: 'Primary pressed', tone: 'success' })}
        />
        <Button
          variant="secondary"
          label="Secondary"
          onPress={() => showToast({ message: 'Secondary pressed' })}
        />
        <Button variant="ghost" label="Ghost" onPress={() => {}} />
        <Button variant="danger" label="Danger" onPress={() => {}} />
        <Button label="Loading" loading onPress={() => {}} />
        <Button label="Disabled" disabled onPress={() => {}} />
        <Button
          label="With icons"
          leadingIcon={Navigation}
          trailingIcon={Clock}
          onPress={() => {}}
        />
      </Section>

      <Section title="Inputs">
        <Input
          label="Full name"
          placeholder="Enter your name"
          value={inputValue}
          onChangeText={setInputValue}
          leadingIcon={Mail}
        />
        <Input label="Password" placeholder="••••••••" secureTextEntry leadingIcon={KeyRound} />
        <Input
          label="Phone"
          placeholder="+91 98765 43210"
          leadingIcon={Phone}
          error="Enter a valid 10-digit number"
        />
        <Input label="Disabled" value="Not editable" disabled />
      </Section>

      <Section title="Status">
        <Row>
          <Badge label="On time" tone="accent" />
          <Badge label="Starts soon" tone="warning" />
          <Badge label="Cancelled" tone="danger" />
          <Badge label="Info" tone="info" />
          <Badge label="Solid" tone="accent" variant="solid" />
        </Row>
      </Section>

      <Section title="Segmented control">
        <SegmentedControl options={vehicles} value={vehicle} onChange={setVehicle} />
      </Section>

      <Section title="Card & list">
        <Card>
          <Row>
            <Avatar name="Aarav Mehta" />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.bodyStrong,
                  { color: colors.textPrimary, fontFamily: fonts.semibold },
                ]}
              >
                Aarav Mehta
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.textSecondary, fontFamily: fonts.regular },
                ]}
              >
                4.9 · Auto · KL 07 AB 1234
              </Text>
            </View>
            <Star size={18} color={colors.warning} strokeWidth={2} fill={colors.warning} />
          </Row>
          <Divider />
          <ListItem icon={Wallet} title="Wallet" value="₹ 0.00" onPress={() => {}} />
          <ListItem icon={Clock} title="Ride history" subtitle="12 rides" onPress={() => {}} />
          <ListItem icon={Star} title="Rate your driver" />
        </Card>
      </Section>

      <Section title="Icon buttons">
        <Row>
          <IconButton icon={Navigation} accessibilityLabel="Go" />
          <IconButton icon={Phone} variant="secondary" accessibilityLabel="Call" />
          <IconButton icon={Clock} variant="danger" accessibilityLabel="Report" badge />
        </Row>
      </Section>

      <Section title="States">
        <Skeleton width="100%" height={72} radius={24} />
        <Row>
          <Skeleton width={48} height={48} radius={16} />
          <Skeleton width={140} height={16} />
        </Row>
        <View style={{ height: 120 }}>
          <Loader label="Loading" />
        </View>
        <ErrorState
          title="Couldn't load rides"
          message="Check your connection and try again."
          onRetry={() => showToast({ message: 'Retrying…', tone: 'info' })}
        />
        <EmptyState
          icon={Clock}
          title="No rides yet"
          message="Your completed rides will appear here."
          action={
            <Button
              label="Book a ride"
              onPress={() => showToast({ message: 'Booking…', tone: 'success' })}
            />
          }
        />
      </Section>

      <Section title="Overlays">
        <Button variant="secondary" label="Open bottom sheet" onPress={() => setSheetOpen(true)} />
        <Button variant="secondary" label="Open confirmation" onPress={() => setDialogOpen(true)} />
      </Section>

      <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title="Choose vehicle">
        <Text style={[typography.body, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
          RideX shows Bike, Auto and Car for riders. Fares always come from the backend.
        </Text>
        <SegmentedControl options={vehicles.slice(0, 3)} value={vehicle} onChange={setVehicle} />
      </Sheet>

      <ConfirmDialog
        visible={dialogOpen}
        title="Cancel this ride?"
        message="This cannot be undone after the ride starts."
        confirmLabel="Yes, cancel"
        tone="danger"
        onConfirm={() => {
          setDialogOpen(false);
          showToast({ message: 'Ride cancelled', tone: 'error' });
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 16,
    paddingVertical: 8,
  },
  section: {
    marginTop: 28,
    gap: 14,
  },
  sectionBody: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
