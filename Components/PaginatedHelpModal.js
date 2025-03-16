import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

function PaginatedHelpModal({onBack}) {
  const [currentPage, setCurrentPage] = useState(1);

  const pages = [
    {
      header: 'Welcome to WordWallet™: a home for your words',
      body: "The purpose of WordWallet™ is to enrich the culture through language. We sincerely believe here at WordWallet™ that words and expressions are the inroads to new places and the medium by which conventional boundaries can be transcended. Language is not only fun and entertaining but a crucial tool for bringing about change and shifting consciousness. That being so we leave it up to you to use this tool to the best of your ingegnuity.",
    },
    {
      header: 'Lexicon',
      body: "Lexicon means 'the vocabulary of a person, language, or branch of knowledge'. Consequently the 'Lexicon' card is where you'll be storing all of your newly learned words or even words that you've invented yourself. Get creative! This is the means by which you will expand your vocabulary. Simply enter the word you want to save into the first input field followed by its definition just below."   ,
    },
    {
      header: 'Translate',
      body: "The 'Translate' card creates the means for users to translate from one language to another, with a selection of over 120 + languages to choose from. You can also add the word and its translation to your Lexicon card making it an ideal resource for foreign students learning a new language."
    },
    {
      header: 'Device',
      body: "The 'Device' card is the place you'll be storing all of your favorite create expressions, whether your heard them from someone or you invented them yourself! Device contains 18 different devices to choose from, from common generic ones, such as 'simile' and 'metaphor' to custom options where you can store  nicknames and memeroable quotes ('Nicknames' & 'Wit & Wisdom).",
    },
    {
      header: 'Dictionary',
      body: "The 'Dictionary' card is the place users resort to when they don't know the meaning of a certain word and want a definition from Oxford Online 'Dictionary'. Test it out! Upon using this card to define a word, users will be listed with a definition and a list of synonyms. Users also have the choice of adding the word they've just defined to their Lexicon card perscribed the definition fetched by the resource. The user also has the option of adding any one of the synonyms fetched to their Lexicon card with the definition that was fetched",
    },
    {
      header: 'Settings',
      body: "Want to customize your wallet? The settings button contains options to change the style of your wallet. You can also change the colors of your three 'text types', 'Common', 'Discovered', and 'Create'. This is the perfect way to make your WordWallet suit your stylistic preference.  The settings button also contains a 'Help' option, which you're reading now. Last but not least it contains a 'Support' button which will direct the user to the email address they can reach out to in case they need help without account management.",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{pages[currentPage - 1].header}</Text>
      <Text style={styles.body}>{pages[currentPage - 1].body}</Text>

      <View style={styles.navigationContainer}>
        {currentPage > 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage(currentPage - 1)}>
            <Text style={styles.navButtonText}>Previous </Text>
          </TouchableOpacity>
        )}
        {currentPage < pages.length && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage(currentPage + 1)}>
            <Text style={styles.navButtonText}>Next </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: wp(5),
    backgroundColor: '#fff',
  },
  header: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  body: {
    fontSize: wp(3.8),
    textAlign: 'center',
    justifyContent: 'center',
    lineHeight: hp(2.5),
    marginVertical: hp(1.5),
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '90%',
    overflow: 'hidden',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: hp(5),
  },
  navButton: {
    backgroundColor: '#2096F3',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  navButtonText: {
    color: '#fff',
    fontSize: wp(3.8),
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#ff6347',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    marginTop: hp(2.5),
  },
  backButtonText: {
    color: '#fff',
    fontSize: wp(3.8),
    textAlign: 'center',
  },
});


export default PaginatedHelpModal;